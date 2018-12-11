import get from 'lodash-es/get'

function computeForTimeline (store, key, defaultValue) {
  store.compute(key,
    ['currentInstance', 'currentTimeline', `timelineData_${key}`],
    (currentInstance, currentTimeline, root) => (
      get(root, [currentInstance, currentTimeline], defaultValue)
    )
  )
}

export function timelineComputations (store) {
  computeForTimeline(store, 'timelineItemIds', null)
  computeForTimeline(store, 'runningUpdate', false)
  computeForTimeline(store, 'lastFocusedElementSelector', null)
  computeForTimeline(store, 'ignoreBlurEvents', false)
  computeForTimeline(store, 'itemIdsToAdd', null)
  computeForTimeline(store, 'showHeader', false)
  computeForTimeline(store, 'shouldShowHeader', false)
  computeForTimeline(store, 'timelineItemIdsAreStale', false)

  store.compute('firstTimelineItemId', ['timelineItemIds'], (timelineItemIds) => {
    return timelineItemIds && timelineItemIds[0]
  })
  store.compute('lastTimelineItemId', ['timelineItemIds'], (timelineItemIds) => {
    return timelineItemIds && timelineItemIds[timelineItemIds.length - 1]
  })

  store.compute('numberOfNotifications',
    [`timelineData_itemIdsToAdd`, 'currentInstance', 'currentTimeline'],
    (root, currentInstance, currentTimeline) => {
      return (
        currentTimeline !== 'notifications' &&
        root &&
        root[currentInstance] &&
        root[currentInstance].notifications &&
        root[currentInstance].notifications.length
      ) || 0
    }
  )

  store.compute('hasNotifications',
    ['numberOfNotifications'],
    (numberOfNotifications) => !!numberOfNotifications
  )
}
