// Pleroma uses base62 IDs, Mastodon uses 0-9 big ints encoded as strings.
// Using base62 for both works, since the first 10 characters of base62
// are 0-9.

import { padStart } from './lodash-lite'

// Pleroma uses the 0-9A-Za-z alphabet for base62, which is the same as ASCII, which
// is the same as JavaScript sort order and IndexedDB order.
const MIN_CHAR_CODE = 48 // '0'.charCodeAt(0)
const MAX_CHAR_CODE = 122 // 'z'.charCodeAt(0)
const MAX_ID_LENGTH = 30 // assume that Mastodon/Pleroma IDs won't get any bigger than this

export function zeroPad (str, toSize) {
  return padStart(str, toSize, '0')
}

export function toPaddedBigInt (id) {
  return zeroPad(id, MAX_ID_LENGTH)
}

export function toReversePaddedBigInt (id) {
  const padded = toPaddedBigInt(id)
  let reversed = ''
  for (let i = 0; i < padded.length; i++) {
    const charCode = padded.charCodeAt(i)
    const inverseCharCode = MIN_CHAR_CODE + MAX_CHAR_CODE - charCode
    reversed += String.fromCharCode(inverseCharCode)
  }
  return reversed
}

export function compareTimelineItemSummaries (left, right) {
  const leftPadded = toPaddedBigInt(left.id)
  const rightPadded = toPaddedBigInt(right.id)
  return leftPadded < rightPadded ? -1 : leftPadded === rightPadded ? 0 : 1
}
