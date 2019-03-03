export function timelineItemToSummary (item) {
  return {
    id: item.id,
    replyId: (item.in_reply_to_id) || void 0,
    reblogId: (item.reblog && item.reblog.id) || void 0,
    type: item.type || void 0
  }
}
