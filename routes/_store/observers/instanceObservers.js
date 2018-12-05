import { updateInstanceInfo, updateVerifyCredentialsForInstance } from '../../_actions/instances'
import { updateListsForInstance } from '../../_actions/lists'
import { createStream } from '../../_actions/streaming'
import { updatePushSubscriptionForInstance } from '../../_actions/pushSubscription'
import { updateCustomEmojiForInstance } from '../../_actions/emoji'
import { addStatusesOrNotifications } from '../../_actions/addStatusOrNotification'
import { getTimeline } from '../../_api/timelines'
import { TIMELINE_BATCH_SIZE } from '../../_static/timelines'
import { scheduleIdleTask } from '../../_utils/scheduleIdleTask'
import { mark, stop } from '../../_utils/marks'

// stream to watch for home timeline updates and notifications
let currentInstanceStream

async function refreshInstanceDataAndStream (store, instanceName) {
  mark(`refreshInstanceDataAndStream-${instanceName}`)
  await doRefreshInstanceDataAndStream(store, instanceName)
  stop(`refreshInstanceDataAndStream-${instanceName}`)
}

function currentInstanceChanged (store, instanceName) {
  return store.get().currentInstance !== instanceName
}

async function doRefreshInstanceDataAndStream (store, instanceName) {
  if (currentInstanceChanged(store, instanceName)) {
    return
  }

  await refreshInstanceData(instanceName)

  if (currentInstanceChanged(store, instanceName)) {
    return
  }

  let { currentInstanceInfo } = store.get()
  if (!currentInstanceInfo) {
    return
  }

  stream(store, instanceName, currentInstanceInfo)
}

async function refreshInstanceData (instanceName) {
  // these are all low-priority
  scheduleIdleTask(() => updateVerifyCredentialsForInstance(instanceName))
  scheduleIdleTask(() => updateCustomEmojiForInstance(instanceName))
  scheduleIdleTask(() => updateListsForInstance(instanceName))
  scheduleIdleTask(() => updatePushSubscriptionForInstance(instanceName))

  // this is the only critical one
  await updateInstanceInfo(instanceName)
}

function stream (store, instanceName, currentInstanceInfo) {
  let homeTimelineItemIds = store.getForTimeline(instanceName,
    'home', 'timelineItemIds')
  let firstHomeTimelineItemId = homeTimelineItemIds && homeTimelineItemIds[0]
  let notificationItemIds = store.getForTimeline(instanceName,
    'notifications', 'timelineItemIds')
  let firstNotificationTimelineItemId = notificationItemIds && notificationItemIds[0]

  let { accessToken } = store.get()
  let streamingApi = currentInstanceInfo.urls.streaming_api

  function onOpenStream () {
    if (currentInstanceChanged(store, instanceName)) {
      return
    }

    /* no await */ fillGap(instanceName, accessToken, 'home', firstHomeTimelineItemId)
    /* no await */ fillGap(instanceName, accessToken, 'notifications', firstNotificationTimelineItemId)
  }

  currentInstanceStream = createStream(streamingApi, instanceName, accessToken, 'home', onOpenStream)

  if (process.env.NODE_ENV !== 'production') {
    window.currentInstanceStream = currentInstanceStream
  }
}

// fill in the "streaming gap" – i.e. fetch the most recent 20 items so that there isn't
// a big gap in the timeline if you haven't looked at it in awhile
async function fillGap (instanceName, accessToken, timelineName, firstTimelineItemId) {
  if (!firstTimelineItemId) {
    return
  }
  let newTimelineItems = await getTimeline(instanceName, accessToken,
    timelineName, null, firstTimelineItemId, TIMELINE_BATCH_SIZE)
  if (newTimelineItems.length) {
    addStatusesOrNotifications(instanceName, timelineName, newTimelineItems)
  }
}

export function instanceObservers (store) {
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

    scheduleIdleTask(() => refreshInstanceDataAndStream(store, currentInstance))
  })
}
