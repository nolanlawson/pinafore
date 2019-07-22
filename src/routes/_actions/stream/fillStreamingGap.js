// TODO: should probably just keep fetching timeline items in the gap, not stop at 40
import { addStatusesOrNotifications } from '../addStatusOrNotification'
import { getTimeline } from '../../_api/timelines'

const TIMELINE_GAP_BATCH_SIZE = 40

// fill in the "streaming gap" – i.e. fetch the most recent items so that there isn't
// a big gap in the timeline if you haven't looked at it in awhile
export async function fillStreamingGap (instanceName, accessToken, timelineName, firstTimelineItemId) {
  const newTimelineItems = await getTimeline(instanceName, accessToken,
    timelineName, null, firstTimelineItemId, TIMELINE_GAP_BATCH_SIZE)
  if (newTimelineItems.length) {
    addStatusesOrNotifications(instanceName, timelineName, newTimelineItems)
  }
}
