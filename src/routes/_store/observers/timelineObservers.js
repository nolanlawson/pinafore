import { updateInstanceInfo } from '../../_actions/instances.js'
import { createStream } from '../../_actions/stream/streaming.js'
import { store } from '../store.js'

export function timelineObservers () {
  // stream to watch for local/federated/etc. updates. home and notification
  // updates are handled in timelineObservers.js
  let currentTimelineStream

  function shutdownPreviousStream () {
    if (currentTimelineStream) {
      currentTimelineStream.close()
      currentTimelineStream = null
      if (process.env.NODE_ENV !== 'production') {
        window.currentTimelineStream = null
      }
    }
  }

  function shouldObserveTimeline (timeline) {
    return timeline &&
      !(
        timeline !== 'local' &&
        timeline !== 'federated' &&
        timeline !== 'direct' &&
        !timeline.startsWith('list/') &&
        !timeline.startsWith('tag/')
      )
  }

  store.observe('currentTimeline', async (currentTimeline) => {
    if (!process.browser) {
      return
    }

    shutdownPreviousStream()

    if (!shouldObserveTimeline(currentTimeline)) {
      return
    }

    const { currentInstance } = store.get()
    const { accessToken } = store.get()
    await updateInstanceInfo(currentInstance)

    const currentTimelineIsUnchanged = () => {
      const {
        currentInstance: newCurrentInstance,
        currentTimeline: newCurrentTimeline
      } = store.get()
      return newCurrentInstance === currentInstance &&
        newCurrentTimeline === currentTimeline
    }

    if (!currentTimelineIsUnchanged()) {
      return
    }

    const firstStatusId = store.getFirstTimelineItemId(currentInstance, currentTimeline)
    const { currentInstanceInfo } = store.get()
    const streamingApi = currentInstanceInfo.urls.streaming_api

    currentTimelineStream = createStream(streamingApi, currentInstance, accessToken,
      currentTimeline, firstStatusId)

    if (process.env.NODE_ENV !== 'production') {
      window.currentTimelineStream = currentTimelineStream
    }
  })
}
