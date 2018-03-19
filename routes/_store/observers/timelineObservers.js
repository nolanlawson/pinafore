import { updateInstanceInfo } from '../../_actions/instances'
import { createStream } from '../../_actions/streaming'
import { getTimeline } from '../../_api/timelines'
import { addStatusesOrNotifications } from '../../_actions/addStatusOrNotification'

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

    let currentInstance = store.get('currentInstance')
    let accessToken = store.get('accessToken')
    await updateInstanceInfo(currentInstance)

    let checkInstanceAndTimelineAreUnchanged = () => (
      store.get('currentInstance') === currentInstance &&
      store.get('currentTimeline') === currentTimeline
    )

    if (!checkInstanceAndTimelineAreUnchanged()) {
      return
    }

    let timelineItemIds = store.getForTimeline(currentInstance,
      currentTimeline, 'timelineItemIds')
    let firstTimelineItemId = timelineItemIds && timelineItemIds[0]

    if (firstTimelineItemId) {
      // fill in the "streaming gap" – i.e. fetch the most recent 20 items so that there isn't
      // a big gap in the timeline if you haven't looked at it in awhile
      // TODO: race condition here, should start streaming while this request is ongoing
      let newTimelineItems = await getTimeline(currentInstance, accessToken, currentTimeline,
        null, firstTimelineItemId)
      if (newTimelineItems.length) {
        addStatusesOrNotifications(currentInstance, currentTimeline, newTimelineItems)
      }
      if (!checkInstanceAndTimelineAreUnchanged()) {
        return
      }
    }

    let instanceInfo = store.get('currentInstanceInfo')
    currentTimelineStream = createStream(instanceInfo.urls.streaming_api,
      currentInstance, accessToken, currentTimeline)

    if (process.env.NODE_ENV !== 'production') {
      window.currentTimelineStream = currentTimelineStream
    }
  })
}
