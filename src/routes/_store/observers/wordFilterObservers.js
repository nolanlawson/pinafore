import { on } from '../../_utils/eventBus'
import { updateFiltersForInstance } from '../../_actions/filters'
import { store } from '../store'
import { isEqual } from 'lodash-es'

export function wordFilterObservers () {
  if (!process.browser) {
    return
  }
  on('wordFiltersChanged', instanceName => {
    /* no await */ updateFiltersForInstance(instanceName)
  })

  function updateUnexpiredFiltersIfUnchanged (now, instanceFilters) {
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
    updateUnexpiredFiltersIfUnchanged(now, instanceFilters)
  })

  store.observe('instanceFilters', instanceFilters => {
    const { now } = store.get()
    updateUnexpiredFiltersIfUnchanged(now, instanceFilters)
  })

  store.observe('currentFilterRegexes', currentFilterRegexes => {
    console.log('currentFilterRegexes changed')
    // timelineData_timelineItemSummaries
    // timelineData_timelineItemSummariesToAdd
  }, { init: false })
}
