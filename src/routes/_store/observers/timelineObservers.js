import { updateInstanceInfo } from '../../_actions/instances'
import { createStream } from '../../_actions/streaming'
import { getTimeline } from '../../_api/timelines'
import { addStatusesOrNotifications } from '../../_actions/addStatusOrNotification'
import { TIMELINE_BATCH_SIZE } from '../../_static/timelines'

export function timelineObservers (store) {
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

    let { currentInstance } = store.get()
    let { accessToken } = store.get()
    await updateInstanceInfo(currentInstance)

    let currentTimelineIsUnchanged = () => {
      let {
        currentInstance: newCurrentInstance,
        currentTimeline: newCurrentTimeline
      } = store.get()
      return newCurrentInstance === currentInstance &&
        newCurrentTimeline === currentTimeline
    }

    if (!currentTimelineIsUnchanged()) {
      return
    }

    let timelineItemIds = store.getForTimeline(currentInstance,
      currentTimeline, 'timelineItemIds')
    let firstTimelineItemId = timelineItemIds && timelineItemIds[0]

    let onOpenStream = async () => {
      if (!firstTimelineItemId || !currentTimelineIsUnchanged()) {
        return
      }
      // fill in the "streaming gap" – i.e. fetch the most recent 20 items so that there isn't
      // a big gap in the timeline if you haven't looked at it in awhile
      let newTimelineItems = await getTimeline(currentInstance, accessToken,
        currentTimeline, null, firstTimelineItemId, TIMELINE_BATCH_SIZE)
      if (newTimelineItems.length) {
        addStatusesOrNotifications(currentInstance, currentTimeline, newTimelineItems)
      }
    }

    let { currentInstanceInfo } = store.get()
    let streamingApi = currentInstanceInfo.urls.streaming_api
    currentTimelineStream = createStream(streamingApi, currentInstance, accessToken,
      currentTimeline, onOpenStream)

    if (process.env.NODE_ENV !== 'production') {
      window.currentTimelineStream = currentTimelineStream
    }
  })
}
