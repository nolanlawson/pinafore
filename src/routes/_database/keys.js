import { toReversePaddedBigInt, zeroPad } from '../_utils/statusIdSorting'

//
// timelines
//

export function createTimelineId (timeline, id) {
  // reverse chronological order, prefixed by timeline
  return timeline + '\u0000' + toReversePaddedBigInt(id)
}

export function createTimelineKeyRange (timeline, maxId) {
  const negBigInt = maxId && toReversePaddedBigInt(maxId)
  const start = negBigInt ? (timeline + '\u0000' + negBigInt) : (timeline + '\u0000')
  const end = timeline + '\u0000\uffff'
  return IDBKeyRange.bound(start, end, true, true)
}

//
// threads
//

export function createThreadId (statusId, i) {
  return statusId + '\u0000' + zeroPad(i, 5)
}

export function createThreadKeyRange (statusId) {
  return IDBKeyRange.bound(
    statusId + '\u0000',
    statusId + '\u0000\uffff'
  )
}

//
// pinned statues
//

export function createPinnedStatusId (accountId, i) {
  return accountId + '\u0000' + zeroPad(i, 3)
}

export function createPinnedStatusKeyRange (accountId) {
  return IDBKeyRange.bound(
    accountId + '\u0000',
    accountId + '\u0000\uffff'
  )
}

//
// accounts
//

export function createAccountUsernamePrefixKeyRange (accountUsernamePrefix) {
  return IDBKeyRange.bound(
    accountUsernamePrefix,
    accountUsernamePrefix + '\uffff'
  )
}
