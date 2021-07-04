import { showMoreItemsForCurrentTimeline } from './timeline.js'
import { scrollToTop } from '../_utils/scrollToTop.js'
import { createStatusOrNotificationUuid } from '../_utils/createStatusOrNotificationUuid.js'
import { store } from '../_store/store.js'
import { tryToFocusElement } from '../_utils/tryToFocusElement.js'

export function showMoreAndScrollToTop () {
  // Similar to Twitter, pressing "." will click the "show more" button and select
  // the first toot.
  showMoreItemsForCurrentTimeline()
  const {
    currentInstance,
    timelineItemSummaries,
    currentTimelineType,
    currentTimelineValue
  } = store.get()
  const firstItemSummary = timelineItemSummaries && timelineItemSummaries[0]
  if (!firstItemSummary) {
    return
  }
  const notificationId = currentTimelineType === 'notifications' && firstItemSummary.id
  const statusId = currentTimelineType !== 'notifications' && firstItemSummary.id
  scrollToTop(/* smooth */ false)
  const id = createStatusOrNotificationUuid(
    currentInstance, currentTimelineType,
    currentTimelineValue, notificationId, statusId
  )
  tryToFocusElement(id)
}
