export function timelineItemToSummary (item) {
  return {
    id: item.id,
    accountId: item.account.id,
    replyId: (item.in_reply_to_id) || undefined,
    reblogId: (item.reblog && item.reblog.id) || undefined,
    type: item.type || undefined
  }
}
