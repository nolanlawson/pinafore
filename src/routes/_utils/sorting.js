// Pleroma uses base62 IDs, Mastodon uses 0-9 big ints encoded as strings.
// Using base62 for both works, since the first 10 characters of base62
// are 0-9.

import { padStart } from './lodash-lite'
import base62 from 'base62'

const MAX_ID_LENGTH = 40 // assume that Mastodon/Pleroma IDs won't get any bigger than this
const MAX_VALUE = Math.pow(10, 39) // ditto

export function zeroPad (str, toSize) {
  return padStart(str, toSize, '0')
}

export function toPaddedBigInt (id) {
  return zeroPad(id, MAX_ID_LENGTH)
}

export function toReversePaddedBigInt (id) {
  let decoded = base62.decode(id)
  let reversed = MAX_VALUE - decoded
  let encoded = base62.encode(reversed)
  return toPaddedBigInt(encoded)
}

export function compareTimelineItemSummaries (left, right) {
  let leftPadded = toPaddedBigInt(left.id)
  let rightPadded = toPaddedBigInt(right.id)
  return leftPadded < rightPadded ? -1 : leftPadded === rightPadded ? 0 : 1
}
