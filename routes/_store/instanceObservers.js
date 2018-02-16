import { updateInstanceInfo, updateVerifyCredentialsForInstance } from '../_actions/instances'
import { updateLists } from '../_actions/lists'
import { createStream } from '../_actions/streaming'

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
    updateVerifyCredentialsForInstance(currentInstance)
    updateInstanceInfo(currentInstance)
    updateLists()

    await updateInstanceInfo(currentInstance)
    let instanceInfo = store.get('currentInstanceInfo')
    if (!(instanceInfo && store.get('currentInstance') === currentInstance)) {
      return
    }

    let accessToken = store.get('accessToken')
    currentInstanceStream = createStream(instanceInfo.urls.streaming_api,
      currentInstance, accessToken, 'home')

    if (process.env.NODE_ENV !== 'production') {
      window.currentInstanceStream = currentInstanceStream
    }
  })
}
