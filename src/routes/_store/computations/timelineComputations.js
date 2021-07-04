import { get } from '../../_utils/lodash-lite.js'
import { getFirstIdFromItemSummaries, getLastIdFromItemSummaries } from '../../_utils/getIdFromItemSummaries.js'
import { mark, stop } from '../../_utils/marks.js'

function computeForTimeline (store, key, defaultValue) {
  store.compute(key,
    ['currentInstance', 'currentTimeline', `timelineData_${key}`],
    (currentInstance, currentTimeline, root) => (
      get(root, [currentInstance, currentTimeline], defaultValue)
    )
  )
}

export function timelineComputations (store) {
  mark('timelineComputations')
  computeForTimeline(store, 'timelineItemSummaries', null)
  computeForTimeline(store, 'timelineItemSummariesToAdd', null)
  computeForTimeline(store, 'runningUpdate', false)
  computeForTimeline(store, 'lastFocusedElementId', null)
  computeForTimeline(store, 'ignoreBlurEvents', false)
  computeForTimeline(store, 'showHeader', false)
  computeForTimeline(store, 'shouldShowHeader', false)
  computeForTimeline(store, 'timelineItemSummariesAreStale', false)
  computeForTimeline(store, 'timelineNextPageId', null)

  store.compute('currentTimelineType', ['currentTimeline'], currentTimeline => (
    currentTimeline && currentTimeline.split('/')[0])
  )
  store.compute('currentTimelineValue', ['currentTimeline'], currentTimeline => {
    if (!currentTimeline) {
      return undefined
    }
    const split = currentTimeline.split('/')
    const len = split.length
    if (split[len - 1] === 'with_replies' || split[len - 1] === 'media') {
      return split[len - 2]
    }
    return split[len - 1]
  })
  store.compute('firstTimelineItemId', ['timelineItemSummaries'], (timelineItemSummaries) => (
    getFirstIdFromItemSummaries(timelineItemSummaries)
  ))
  store.compute('lastTimelineItemId', ['timelineItemSummaries'], (timelineItemSummaries) => (
    getLastIdFromItemSummaries(timelineItemSummaries)
  ))
  stop('timelineComputations')
}
