import { on } from '../../_utils/eventBus.js'
import { updateFiltersForInstance } from '../../_actions/filters.js'
import { store } from '../store.js'
import { isEqual } from '../../_thirdparty/lodash/objects.js'
import { computeFilterContextsForStatusOrNotification } from '../../_utils/computeFilterContextsForStatusOrNotification.js'
import { database } from '../../_database/database.js'
import { mark, stop } from '../../_utils/marks.js'

export function wordFilterObservers () {
  if (!process.browser) {
    return
  }
  on('wordFiltersChanged', instanceName => {
    /* no await */ updateFiltersForInstance(instanceName)
  })

  // compute `unexpiredInstanceFilters` based on `now` and `instanceFilters`. `now` updates every 10 seconds.
  function updateUnexpiredInstanceFiltersIfUnchanged (now, instanceFilters) {
    const unexpiredInstanceFilters = Object.fromEntries(Object.entries(instanceFilters).map(([instanceName, filters]) => {
      const unexpiredFilters = filters.filter(filter => (
        !filter.expires_at || new Date(filter.expires_at).getTime() >= now
      ))
      return [instanceName, unexpiredFilters]
    }))

    // don't force an update/recalc if nothing changed
    if (!isEqual(store.get().unexpiredInstanceFilters, unexpiredInstanceFilters)) {
      console.log('updated unexpiredInstanceFilters', unexpiredInstanceFilters)
      store.set({ unexpiredInstanceFilters })
    }
  }

  store.observe('now', now => {
    const { instanceFilters } = store.get()
    updateUnexpiredInstanceFiltersIfUnchanged(now, instanceFilters)
  })

  store.observe('instanceFilters', instanceFilters => {
    const { now } = store.get()
    updateUnexpiredInstanceFiltersIfUnchanged(now, instanceFilters)
  })

  store.observe('unexpiredInstanceFilterRegexes', async unexpiredInstanceFilterRegexes => {
    console.log('unexpiredInstanceFilterRegexes changed, recomputing filterContexts')
    mark('update timeline item summary filter contexts')
    // Whenever the filters change, we need to re-compute the filterContexts on the TimelineSummaries.
    // This is a bit of an odd design, but we do it for perf. See timelineItemToSummary.js for details.
    let {
      timelineData_timelineItemSummaries: timelineItemSummaries,
      timelineData_timelineItemSummariesToAdd: timelineItemSummariesToAdd
    } = store.get()

    timelineItemSummaries = timelineItemSummaries || {}
    timelineItemSummariesToAdd = timelineItemSummariesToAdd || {}

    let somethingChanged = false

    await Promise.all(Object.entries(unexpiredInstanceFilterRegexes).map(async ([instanceName, contextsToRegex]) => {
      const timelinesToSummaries = timelineItemSummaries[instanceName] || {}
      const timelinesToSummariesToAdd = timelineItemSummariesToAdd[instanceName] || {}
      const summariesToUpdate = [
        ...(Object.values(timelinesToSummaries).flat()),
        ...(Object.values(timelinesToSummariesToAdd).flat())
      ]
      console.log(`Attempting to update filters for ${summariesToUpdate.length} item summaries`)
      await Promise.all(summariesToUpdate.map(async summary => {
        try {
          const isNotification = summary.type
          const item = await (isNotification
            ? database.getNotification(instanceName, summary.id)
            : database.getStatus(instanceName, summary.id)
          )
          const newFilterContexts = computeFilterContextsForStatusOrNotification(item, contextsToRegex)
          if (!isEqual(summary.filterContexts, newFilterContexts)) {
            somethingChanged = true
            summary.filterContexts = newFilterContexts
          }
        } catch (err) {
          console.error(err)
          // not stored in the database anymore, just ignore
        }
      }))
    }))

    // The previous was an async operation, so the timelinesItemSummaries or timelineItemSummariesToAdd
    // may have changed. But we need to make sure that the filterContexts are updated in the store
    // So just force an update here.
    if (somethingChanged) {
      console.log('Word filters changed, forcing an update')
      // eslint-disable-next-line camelcase
      const { timelineData_timelineItemSummaries, timelineData_timelineItemSummariesToAdd } = store.get()
      store.set({ timelineData_timelineItemSummaries, timelineData_timelineItemSummariesToAdd })
    }
    stop('update timeline item summary filter contexts')
  }, { init: false })
}
