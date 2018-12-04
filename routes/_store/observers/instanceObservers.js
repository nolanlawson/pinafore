import { updateInstanceInfo, updateVerifyCredentialsForInstance } from '../../_actions/instances'
import { updateLists } from '../../_actions/lists'
import { createStream } from '../../_actions/streaming'
import { updatePushSubscriptionForInstance } from '../../_actions/pushSubscription'
import { updateCustomEmojiForInstance } from '../../_actions/emoji'
import { addStatusesOrNotifications } from '../../_actions/addStatusOrNotification'
import { getTimeline } from '../../_api/timelines'
import { TIMELINE_BATCH_SIZE } from '../../_static/timelines'

export function instanceObservers (store) {
  // stream to watch for home timeline updates and notifications
  let currentInstanceStream

  store.observe('currentInstance', async (currentInstance) => {
    if (!process.browser) {
      return
    }
    if (currentInstanceStream) {
      currentInstanceStream.close()
      currentInstanceStream = null
      if (process.env.NODE_ENV !== 'production') {
        window.currentInstanceStream = null
      }
    }
    if (!currentInstance) {
      return
    }

    /* no await */ updateVerifyCredentialsForInstance(currentInstance)
    /* no await */ updateCustomEmojiForInstance(currentInstance)
    /* no await */ updateLists()
    /* no await */ updatePushSubscriptionForInstance(currentInstance)
    await updateInstanceInfo(currentInstance)

    let currentInstanceIsUnchanged = () => {
      let { currentInstance: newCurrentInstance } = store.get()
      return newCurrentInstance === currentInstance
    }

    if (!currentInstanceIsUnchanged()) {
      return
    }

    let { currentInstanceInfo } = store.get()
    if (!currentInstanceInfo) {
      return
    }

    let homeTimelineItemIds = store.getForTimeline(currentInstance,
      'home', 'timelineItemIds')
    let firstHomeTimelineItemId = homeTimelineItemIds && homeTimelineItemIds[0]
    let notificationItemIds = store.getForTimeline(currentInstance,
      'notifications', 'timelineItemIds')
    let firstNotificationTimelineItemId = notificationItemIds && notificationItemIds[0]

    let onOpenStream = async () => {
      if (!currentInstanceIsUnchanged()) {
        return
      }

      // fill in the "streaming gap" – i.e. fetch the most recent 20 items so that there isn't
      // a big gap in the timeline if you haven't looked at it in awhile
      async function fillGap (timelineName, firstTimelineItemId) {
        if (!firstTimelineItemId) {
          return
        }
        let newTimelineItems = await getTimeline(currentInstance, accessToken,
          timelineName, null, firstTimelineItemId, TIMELINE_BATCH_SIZE)
        if (newTimelineItems.length) {
          addStatusesOrNotifications(currentInstance, timelineName, newTimelineItems)
        }
      }

      await Promise.all([
        fillGap('home', firstHomeTimelineItemId),
        fillGap('notifications', firstNotificationTimelineItemId)
      ])
    }

    let { accessToken } = store.get()
    let streamingApi = currentInstanceInfo.urls.streaming_api
    currentInstanceStream = createStream(streamingApi,
      currentInstance, accessToken, 'home', onOpenStream)

    if (process.env.NODE_ENV !== 'production') {
      window.currentInstanceStream = currentInstanceStream
    }
  })
}
