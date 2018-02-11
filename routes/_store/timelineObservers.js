import { updateInstanceInfo } from '../_actions/instances'
import { createStream } from '../_actions/streaming'

export function timelineObservers (store) {
  let currentTimelineStream

  store.observe('currentTimeline', async (currentTimeline) => {
    if (!process.browser) {
      return
    }
    if (currentTimelineStream) {
      currentTimelineStream.close()
      currentTimelineStream = null
    }
    if (!currentTimeline) {
      return
    }
    if (!(['home', 'local', 'federated'].includes(currentTimeline) ||
        currentTimeline.startsWith('list/') ||
        currentTimeline.startsWith('tag/'))) {
      return
    }

    let currentInstance = store.get('currentInstance')
    let accessToken = store.get('accessToken')
    await updateInstanceInfo(currentInstance)
    let instanceInfo = store.get('currentInstanceInfo')
    if (!(instanceInfo &&
        store.get('currentInstance') === currentInstance &&
        store.get('currentTimeline') === currentTimeline)) {
      return
    }

    currentTimelineStream = createStream(instanceInfo.urls.streaming_api,
      currentInstance, accessToken, currentTimeline)
  })
}
