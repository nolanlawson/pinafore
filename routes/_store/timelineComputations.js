
function computeForTimeline(store, key) {
  store.compute(key, ['currentTimelineData'], (currentTimelineData) => currentTimelineData[key])
}


export function timelineComputations (store) {
  store.compute('currentTimelineData', ['currentInstance', 'currentTimeline', 'timelines'],
    (currentInstance, currentTimeline, timelines) => {
      return ((timelines && timelines[currentInstance]) || {})[currentTimeline] || {}
    })

  computeForTimeline(store, 'timelineItemIds')
  computeForTimeline(store, 'runningUpdate')
  computeForTimeline(store, 'initialized')
  computeForTimeline(store, 'lastFocusedElementSelector')

  store.compute('lastTimelineItemId', ['timelineItemIds'], (timelineItemIds) => timelineItemIds && timelineItemIds.length && timelineItemIds[timelineItemIds.length - 1])
}
