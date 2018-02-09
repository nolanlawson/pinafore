export function timelineComputations(store) {
  store.compute('currentTimelineData', ['currentInstance', 'currentTimeline', 'timelines'],
    (currentInstance, currentTimeline, timelines) => {
      return ((timelines && timelines[currentInstance]) || {})[currentTimeline] || {}
    })

  store.compute('timelineItemIds', ['currentTimelineData'], (currentTimelineData) => currentTimelineData.timelineItemIds)
  store.compute('runningUpdate', ['currentTimelineData'], (currentTimelineData) => currentTimelineData.runningUpdate)
  store.compute('initialized', ['currentTimelineData'], (currentTimelineData) => currentTimelineData.initialized)
  store.compute('lastTimelineItemId', ['timelineItemIds'], (timelineItemIds) => timelineItemIds && timelineItemIds.length && timelineItemIds[timelineItemIds.length - 1])
}