// This is designed to exactly mimic Mastodon's ordering for threads. As described by Gargron:
// "statuses are ordered in the postgresql query and then any of OP's self-replies bubble to the top"
// Source: https://github.com/tootsuite/mastodon/blob/ef15246/app/models/concerns/status_threading_concern.rb
import {concat} from './arrays';
import { compareTimelineItemSummaries } from './statusIdSorting'

export function sortItemSummariesForThread (summaries, statusId) {
  const ancestors = []
  const descendants = []

  const status = summaries.find(_ => _.id === statusId)
  if (!status) {
    // bail out, for some reason we can't find the status (should never happen)
    return summaries
  }

  // find ancestors
  let currentStatus = status
  do {
    currentStatus = summaries.find(_ => _.id === (currentStatus.replyId))
    if (currentStatus) {
      ancestors.unshift(currentStatus)
    }
  } while (currentStatus)

  // Normally descendants are sorted in depth-first order, via normal ID sorting
  // but replies that come from the account they're actually replying to get promoted

  // find descendants
  let stack = summaries.filter(_ => _.replyId === status.id).sort(compareDescendants)
  while (stack.length) {
    const current = stack.shift()
    const newChildren = summaries.filter(_ => _.replyId === current.id).sort(compareDescendants)
    stack = concat(newChildren, stack)
    descendants.push(current)
  }

  const rootAccountId = status.accountId

  let currentReplyId = status.id
  for (let i = 0; i < descendants.length; i++) {
    const descendant = descendants[i]

  }

  return concat(
    ancestors,
    [status],
    descendants
  )
}
