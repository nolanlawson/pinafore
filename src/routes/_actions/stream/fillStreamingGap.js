import { addStatusesOrNotifications } from '../addStatusOrNotification'
import { getTimeline } from '../../_api/timelines'

const TIMELINE_GAP_BATCH_SIZE = 20 // Mastodon timeline API maximum limit
const MAX_NUM_REQUESTS = 15 // to avoid getting caught in an infinite loop somehow

// fill in the "streaming gap" – i.e. fetch the most recent items so that there isn't
// a big gap in the timeline if you haven't looked at it in awhile
export async function fillStreamingGap (instanceName, accessToken, timelineName, firstTimelineItemId) {
  let maxId = null
  let numRequests = 0
  let newTimelineItems

  do {
    numRequests++
    newTimelineItems = (await getTimeline(instanceName, accessToken,
      timelineName, maxId, firstTimelineItemId, TIMELINE_GAP_BATCH_SIZE)).items
    if (newTimelineItems.length) {
      addStatusesOrNotifications(instanceName, timelineName, newTimelineItems)
      maxId = newTimelineItems[newTimelineItems.length - 1].id
    }
  } while (numRequests < MAX_NUM_REQUESTS && newTimelineItems.length === TIMELINE_GAP_BATCH_SIZE)
}
