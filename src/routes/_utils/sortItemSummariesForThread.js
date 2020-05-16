// This is designed to exactly mimic Mastodon's ordering for threads. As described by Gargron:
// "statuses are ordered in the postgresql query and then any of OP's self-replies bubble to the top"
// Source: https://github.com/tootsuite/mastodon/blob/ef15246/app/models/concerns/status_threading_concern.rb
import { concat } from './arrays'
import { compareTimelineItemSummaries } from './statusIdSorting'
import { mapBy, multimapBy } from './maps'

export function sortItemSummariesForThread (summaries, statusId) {
  const ancestors = []
  const descendants = []
  const summariesById = mapBy(summaries, _ => _.id)
  const summariesByReplyId = multimapBy(summaries, _ => _.replyId)

  const status = summariesById.get(statusId)
  if (!status) {
    // bail out, for some reason we can't find the status (should never happen)
    return summaries
  }

  // find ancestors
  let currentStatus = status
  do {
    currentStatus = summariesById.get(currentStatus.replyId)
    if (currentStatus) {
      ancestors.unshift(currentStatus)
    }
  } while (currentStatus)

  // find descendants
  // This mirrors the depth-first ordering used in the Postgres query in the Mastodon implementation
  const stack = [status]
  while (stack.length) {
    const current = stack.shift()
    const newChildren = (summariesByReplyId.get(current.id) || []).sort(compareTimelineItemSummaries)
    Array.prototype.unshift.apply(stack, newChildren)
    if (current.id !== status.id) { // the status is not a descendant of itself
      descendants.push(current)
    }
  }

  // Normally descendants are sorted in depth-first order, via normal ID sorting
  // but replies that come from the account they're actually replying to get promoted
  // This only counts if it's an unbroken self-reply, e.g. in the case of
  //     A -> A -> A -> B -> A -> A
  // B has broken the chain, so only the first three As are considered unbroken self-replies
  const isUnbrokenSelfReply = (descendant) => {
    let current = descendant
    while (true) {
      if (current.accountId !== status.accountId) {
        return false
      }
      const parent = summariesById.get(current.replyId)
      if (!parent) {
        break
      }
      current = parent
    }
    return current.id === statusId
  }

  const promotedDescendants = []
  const otherDescendants = []
  for (const descendant of descendants) {
    (isUnbrokenSelfReply(descendant) ? promotedDescendants : otherDescendants).push(descendant)
  }

  return concat(
    ancestors,
    [status],
    promotedDescendants,
    otherDescendants
  )
}
