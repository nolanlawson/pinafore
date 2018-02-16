import { updateInstanceInfo } from '../_actions/instances'
import { createStream } from '../_actions/streaming'

export function timelineObservers (store) {
  // stream to watch for local/federated/etc. updates. home and notification
  // updates are handled in timelineObservers.js
  let currentTimelineStream

  store.observe('currentTimeline', async (currentTimeline) => {
    if (!process.browser) {
      return
    }
    if (currentTimelineStream) {
      currentTimelineStream.close()
      currentTimelineStream = null
      if (process.env.NODE_ENV !== 'production') {
        window.currentTimelineStream = null
      }
    }
    if (!currentTimeline) {
      return
    }
    if (currentTimeline !== 'local' &&
        currentTimeline !== 'federated' &&
        !currentTimeline.startsWith('list/') &&
        !currentTimeline.startsWith('tag/')) {
      return
    }

    let currentInstance = store.get('currentInstance')
    await updateInstanceInfo(currentInstance)
    let instanceInfo = store.get('currentInstanceInfo')
    if (!(instanceInfo &&
        store.get('currentInstance') === currentInstance &&
        store.get('currentTimeline') === currentTimeline)) {
      return
    }

    let accessToken = store.get('accessToken')
    currentTimelineStream = createStream(instanceInfo.urls.streaming_api,
      currentInstance, accessToken, currentTimeline)

    if (process.env.NODE_ENV !== 'production') {
      window.currentTimelineStream = currentTimelineStream
    }
  })
}
