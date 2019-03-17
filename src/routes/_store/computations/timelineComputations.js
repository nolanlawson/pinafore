import { get } from '../../_utils/lodash-lite'
import { getFirstIdFromItemSummaries, getLastIdFromItemSummaries } from '../../_utils/getIdFromItemSummaries'

function computeForTimeline (store, key, defaultValue) {
  store.compute(key,
    ['currentInstance', 'currentTimeline', `timelineData_${key}`],
    (currentInstance, currentTimeline, root) => (
      get(root, [currentInstance, currentTimeline], defaultValue)
    )
  )
}

export function timelineComputations (store) {
  computeForTimeline(store, 'timelineItemSummaries', null)
  computeForTimeline(store, 'timelineItemSummariesToAdd', null)
  computeForTimeline(store, 'runningUpdate', false)
  computeForTimeline(store, 'lastFocusedElementId', null)
  computeForTimeline(store, 'ignoreBlurEvents', false)
  computeForTimeline(store, 'showHeader', false)
  computeForTimeline(store, 'shouldShowHeader', false)
  computeForTimeline(store, 'timelineItemSummariesAreStale', false)

  store.compute('currentTimelineType', ['currentTimeline'], currentTimeline => (
    currentTimeline && currentTimeline.split('/')[0])
  )
  store.compute('currentTimelineValue', ['currentTimeline'], currentTimeline => (
    currentTimeline && currentTimeline.split('/').slice(-1)[0])
  )
  store.compute('firstTimelineItemId', ['timelineItemSummaries'], (timelineItemSummaries) => (
    getFirstIdFromItemSummaries(timelineItemSummaries)
  ))
  store.compute('lastTimelineItemId', ['timelineItemSummaries'], (timelineItemSummaries) => (
    getLastIdFromItemSummaries(timelineItemSummaries)
  ))

  store.compute('numberOfNotifications',
    [`timelineData_timelineItemSummariesToAdd`, 'currentInstance'],
    (root, currentInstance) => (
      (root && root[currentInstance] && root[currentInstance].notifications &&
        root[currentInstance].notifications.length) || 0
    )
  )

  store.compute('hasNotifications',
    ['numberOfNotifications', 'currentPage'],
    (numberOfNotifications, currentPage) => currentPage !== 'notifications' && !!numberOfNotifications
  )
}
