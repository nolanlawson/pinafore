import { get } from '../../_utils/lodash-lite'
import { getFirstIdFromItemSummaries, getLastIdFromItemSummaries } from '../../_utils/getIdFromItemSummaries'
import {
  HOME_REBLOGS,
  HOME_REPLIES,
  NOTIFICATION_REBLOGS,
  NOTIFICATION_FOLLOWS,
  NOTIFICATION_FAVORITES,
  NOTIFICATION_POLLS,
  NOTIFICATION_MENTIONS
} from '../../_static/instanceSettings'
import { createFilterFunction } from '../../_utils/createFilterFunction'
import { mark, stop } from '../../_utils/marks'

function computeForTimeline (store, key, defaultValue) {
  store.compute(key,
    ['currentInstance', 'currentTimeline', `timelineData_${key}`],
    (currentInstance, currentTimeline, root) => (
      get(root, [currentInstance, currentTimeline], defaultValue)
    )
  )
}

// Compute just the boolean, e.g. 'showPolls', so that we can use that boolean as
// the input to the timelineFilterFunction computations. This should reduce the need to
// re-compute the timelineFilterFunction over and over.
function computeTimelineFilter (store, computationName, timelinesToSettingsKeys) {
  store.compute(
    computationName,
    ['currentInstance', 'instanceSettings', 'currentTimeline'],
    (currentInstance, instanceSettings, currentTimeline) => {
      const settingsKey = timelinesToSettingsKeys[currentTimeline]
      return settingsKey ? get(instanceSettings, [currentInstance, settingsKey], true) : true
    }
  )
}

// Ditto for notifications, which we always have to keep track of due to the notification count.
function computeNotificationFilter (store, computationName, key) {
  store.compute(
    computationName,
    ['currentInstance', 'instanceSettings'],
    (currentInstance, instanceSettings) => {
      return get(instanceSettings, [currentInstance, key], true)
    }
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

  computeTimelineFilter(store, 'timelineShowReblogs', { home: HOME_REBLOGS, notifications: NOTIFICATION_REBLOGS })
  computeTimelineFilter(store, 'timelineShowReplies', { home: HOME_REPLIES })
  computeTimelineFilter(store, 'timelineShowFollows', { notifications: NOTIFICATION_FOLLOWS })
  computeTimelineFilter(store, 'timelineShowFavs', { notifications: NOTIFICATION_FAVORITES })
  computeTimelineFilter(store, 'timelineShowMentions', { notifications: NOTIFICATION_MENTIONS })
  computeTimelineFilter(store, 'timelineShowPolls', { notifications: NOTIFICATION_POLLS })

  computeNotificationFilter(store, 'timelineNotificationShowReblogs', NOTIFICATION_REBLOGS)
  computeNotificationFilter(store, 'timelineNotificationShowFollows', NOTIFICATION_FOLLOWS)
  computeNotificationFilter(store, 'timelineNotificationShowFavs', NOTIFICATION_FAVORITES)
  computeNotificationFilter(store, 'timelineNotificationShowMentions', NOTIFICATION_MENTIONS)
  computeNotificationFilter(store, 'timelineNotificationShowPolls', NOTIFICATION_POLLS)

  store.compute(
    'timelineFilterFunction',
    [
      'timelineShowReblogs', 'timelineShowReplies', 'timelineShowFollows',
      'timelineShowFavs', 'timelineShowMentions', 'timelineShowPolls'
    ],
    (showReblogs, showReplies, showFollows, showFavs, showMentions, showPolls) => (
      createFilterFunction(showReblogs, showReplies, showFollows, showFavs, showMentions, showPolls)
    )
  )

  store.compute(
    'timelineNotificationFilterFunction',
    [
      'timelineNotificationShowReblogs', 'timelineNotificationShowFollows',
      'timelineNotificationShowFavs', 'timelineNotificationShowMentions',
      'timelineNotificationShowPolls'
    ],
    (showReblogs, showFollows, showFavs, showMentions, showPolls) => (
      createFilterFunction(showReblogs, true, showFollows, showFavs, showMentions, showPolls)
    )
  )

  store.compute(
    'filteredTimelineItemSummaries',
    ['timelineItemSummaries', 'timelineFilterFunction'],
    (timelineItemSummaries, timelineFilterFunction) => {
      return timelineItemSummaries && timelineItemSummaries.filter(timelineFilterFunction)
    }
  )

  store.compute(
    'filteredTimelineItemSummariesToAdd',
    ['timelineItemSummariesToAdd', 'timelineFilterFunction'],
    (timelineItemSummariesToAdd, timelineFilterFunction) => {
      return timelineItemSummariesToAdd && timelineItemSummariesToAdd.filter(timelineFilterFunction)
    }
  )

  store.compute('timelineNotificationItemSummaries',
    ['timelineData_timelineItemSummariesToAdd', 'timelineFilterFunction', 'currentInstance'],
    (root, timelineFilterFunction, currentInstance) => (
      get(root, [currentInstance, 'notifications'])
    )
  )

  store.compute(
    'filteredTimelineNotificationItemSummaries',
    ['timelineNotificationItemSummaries', 'timelineNotificationFilterFunction'],
    (timelineNotificationItemSummaries, timelineNotificationFilterFunction) => (
      timelineNotificationItemSummaries && timelineNotificationItemSummaries.filter(timelineNotificationFilterFunction)
    )
  )

  store.compute('numberOfNotifications',
    ['filteredTimelineNotificationItemSummaries', 'disableNotificationBadge'],
    (filteredTimelineNotificationItemSummaries, disableNotificationBadge) => (
      (!disableNotificationBadge && filteredTimelineNotificationItemSummaries)
        ? filteredTimelineNotificationItemSummaries.length
        : 0
    )
  )

  store.compute('hasNotifications',
    ['numberOfNotifications', 'currentPage'],
    (numberOfNotifications, currentPage) => (
      currentPage !== 'notifications' && !!numberOfNotifications
    )
  )

  store.compute('numberOfFollowRequests',
    ['followRequestCounts', 'currentInstance'],
    (followRequestCounts, currentInstance) => get(followRequestCounts, [currentInstance], 0)
  )

  store.compute('hasFollowRequests',
    ['numberOfFollowRequests'],
    (numberOfFollowRequests) => !!numberOfFollowRequests
  )
  stop('timelineComputations')
}
