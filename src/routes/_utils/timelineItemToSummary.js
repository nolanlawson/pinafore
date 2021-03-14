import { computeFilterContextsForStatusOrNotification } from './computeFilterContextsForStatusOrNotification'
import { store } from '../_store/store'

class TimelineSummary {
  constructor (item, instanceName) {
    this.id = item.id
    this.accountId = item.account.id
    this.replyId = (item.in_reply_to_id) || undefined
    this.reblogId = (item.reblog && item.reblog.id) || undefined
    this.type = item.type || undefined

    // This is admittedly a weird place to do the filtering logic. But there are a few reasons to do it here:
    // 1. Avoid computing html-to-text (expensive) for users who don't have any filters (probably most users)
    // 2. Avoiding keeping the entire html-to-text in memory at all times for all summaries
    // 3. Filters probably change infrequently. When they do, we can just update the summaries
    const { unexpiredInstanceFilterRegexes } = store.get()
    const contextsToRegex = unexpiredInstanceFilterRegexes[instanceName]
    this.filterContexts = computeFilterContextsForStatusOrNotification(item, contextsToRegex)
  }
}

export function timelineItemToSummary (item, instanceName) {
  return new TimelineSummary(item, instanceName)
}
