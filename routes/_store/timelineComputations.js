export function timelineComputations(store) {
  store.compute('currentTimelineData', ['currentInstance', 'currentTimeline', 'timelines'],
    (currentInstance, currentTimeline, timelines) => {
      return ((timelines && timelines[currentInstance]) || {})[currentTimeline] || {}
    })

  store.compute('statusIds', ['currentTimelineData'], (currentTimelineData) => currentTimelineData.statusIds || [])
  store.compute('runningUpdate', ['currentTimelineData'], (currentTimelineData) => currentTimelineData.runningUpdate)
  store.compute('initialized', ['currentTimelineData'], (currentTimelineData) => currentTimelineData.initialized)
  store.compute('lastStatusId', ['statusIds'], (statusIds) => statusIds.length && statusIds[statusIds.length - 1])
}