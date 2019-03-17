import { showMoreItemsForCurrentTimeline } from './timeline'
import { scrollToTop } from '../_utils/scrollToTop'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'
import { createStatusOrNotificationUuid } from '../_utils/createStatusOrNotificationUuid'
import { store } from '../_store/store'

const RETRIES = 5
const TIMEOUT = 50

export function showMoreAndScrollToTop () {
  // Similar to Twitter, pressing "." will click the "show more" button and select
  // the first toot.
  showMoreItemsForCurrentTimeline()
  let {
    currentInstance,
    timelineItemSummaries,
    currentTimelineType,
    currentTimelineValue
  } = store.get()
  let firstItemSummary = timelineItemSummaries && timelineItemSummaries[0]
  if (!firstItemSummary) {
    return
  }
  let notificationId = currentTimelineType === 'notifications' && firstItemSummary.id
  let statusId = currentTimelineType !== 'notifications' && firstItemSummary.id
  scrollToTop(/* smooth */ false)
  // try 5 times to wait for the element to be rendered and then focus it
  let count = 0
  const tryToFocusElement = () => {
    let uuid = createStatusOrNotificationUuid(
      currentInstance, currentTimelineType,
      currentTimelineValue, notificationId, statusId
    )
    let element = document.getElementById(uuid)
    if (element) {
      try {
        element.focus({ preventScroll: true })
      } catch (e) {
        console.error(e)
      }
    } else {
      if (++count <= RETRIES) {
        setTimeout(() => scheduleIdleTask(tryToFocusElement), TIMEOUT)
      }
    }
  }
  scheduleIdleTask(tryToFocusElement)
}
