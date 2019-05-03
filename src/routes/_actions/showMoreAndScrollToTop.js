import { showMoreItemsForCurrentTimeline } from './timeline'
import { scrollToTop } from '../_utils/scrollToTop'
import { createStatusOrNotificationUuid } from '../_utils/createStatusOrNotificationUuid'
import { store } from '../_store/store'
import { tryToFocusElement } from '../_utils/tryToFocusElement'

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
  let elementId = createStatusOrNotificationUuid(
    currentInstance, currentTimelineType,
    currentTimelineValue, notificationId, statusId
  )
  tryToFocusElement(() => document.getElementById(elementId))
}
