import {
  HOME_REBLOGS,
  HOME_REPLIES,
  NOTIFICATION_FAVORITES,
  NOTIFICATION_FOLLOWS, NOTIFICATION_MENTIONS, NOTIFICATION_POLLS,
  NOTIFICATION_REBLOGS
} from '../../_static/instanceSettings.js'
import {
  WORD_FILTER_CONTEXT_ACCOUNT,
  WORD_FILTER_CONTEXT_HOME,
  WORD_FILTER_CONTEXT_NOTIFICATIONS,
  WORD_FILTER_CONTEXT_PUBLIC, WORD_FILTER_CONTEXT_THREAD
} from '../../_static/wordFilters.js'
import { createFilterFunction } from '../../_utils/createFilterFunction.js'
import { get } from '../../_utils/lodash-lite.js'

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

export function timelineFilterComputations (store) {
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
    'timelineWordFilterContext',
    ['currentTimeline'],
    (currentTimeline) => {
      if (!currentTimeline) {
        return
      }
      if (currentTimeline === 'home' || currentTimeline.startsWith('list/')) {
        return WORD_FILTER_CONTEXT_HOME
      }
      if (currentTimeline === 'notifications' || currentTimeline.startsWith('notifications/')) {
        return WORD_FILTER_CONTEXT_NOTIFICATIONS
      }
      if (currentTimeline === 'federated' || currentTimeline === 'local' || currentTimeline.startsWith('tag/')) {
        return WORD_FILTER_CONTEXT_PUBLIC
      }
      if (currentTimeline.startsWith('account/')) {
        return WORD_FILTER_CONTEXT_ACCOUNT
      }
      if (currentTimeline.startsWith('status/')) {
        return WORD_FILTER_CONTEXT_THREAD
      }
      // return undefined otherwise
    }
  )

  // This one is based on whatever the current timeline is
  store.compute(
    'timelineFilterFunction',
    [
      'timelineShowReblogs', 'timelineShowReplies', 'timelineShowFollows',
      'timelineShowFavs', 'timelineShowMentions', 'timelineShowPolls',
      'timelineWordFilterContext'
    ],
    (showReblogs, showReplies, showFollows, showFavs, showMentions, showPolls, wordFilterContext) => (
      createFilterFunction(showReblogs, showReplies, showFollows, showFavs, showMentions, showPolls, wordFilterContext)
    )
  )

  // The reason there is a completely separate flow just for notifications is that we need to
  // know which notifications are filtered at all times so that the little number badge is correct.
  store.compute(
    'timelineNotificationFilterFunction',
    [
      'timelineNotificationShowReblogs', 'timelineNotificationShowFollows',
      'timelineNotificationShowFavs', 'timelineNotificationShowMentions',
      'timelineNotificationShowPolls'
    ],
    (showReblogs, showFollows, showFavs, showMentions, showPolls) => (
      createFilterFunction(showReblogs, true, showFollows, showFavs, showMentions, showPolls, WORD_FILTER_CONTEXT_NOTIFICATIONS)
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
}
