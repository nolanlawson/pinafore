class TimelineSummary {
  constructor (item) {
    this.id = item.id
    this.accountId = item.account.id
    this.replyId = (item.in_reply_to_id) || undefined
    this.reblogId = (item.reblog && item.reblog.id) || undefined
    this.type = item.type || undefined
  }
}

export function timelineItemToSummary (item) {
  return new TimelineSummary(item)
}
