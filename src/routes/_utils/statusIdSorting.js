// Pleroma uses base62 IDs, Mastodon uses 0-9 big ints encoded as strings.
// Using base62 for both works, since the first 10 characters of base62
// are 0-9.

import { padStart } from './lodash-lite'

// Unfortunately base62 ordering is not the same as JavaScript's default ASCII ordering,
// used both for JS string comparisons as well as IndexedDB ordering.
const BASE62_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ASCII_ORDERING = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const MAX_ID_LENGTH = 30 // assume that Mastodon/Pleroma IDs won't get any bigger than this

const BASE62_LOOKUP = new Map(BASE62_ALPHABET.split('').map((char, i) => ([char, i])))

export function zeroPad (str, toSize) {
  return padStart(str, toSize, '0')
}

export function toPaddedBigInt (id) {
  let asciiOrdered = ''
  for (let i = 0; i < id.length; i++) {
    let char = id.charAt(i)
    let idx = BASE62_LOOKUP.get(char)
    let asciiChar = ASCII_ORDERING[idx]
    asciiOrdered += asciiChar
  }
  return zeroPad(asciiOrdered, MAX_ID_LENGTH)
}

export function toReversePaddedBigInt (id) {
  let padded = zeroPad(id, MAX_ID_LENGTH)
  let reversed = ''
  for (let i = 0; i < padded.length; i++) {
    let char = padded.charAt(i)
    let idx = BASE62_LOOKUP.get(char)
    let reverseIdx = BASE62_ALPHABET.length - 1 - idx
    reversed += ASCII_ORDERING[reverseIdx]
  }
  return reversed
}

export function compareTimelineItemSummaries (left, right) {
  let leftPadded = toPaddedBigInt(left.id)
  let rightPadded = toPaddedBigInt(right.id)
  return leftPadded < rightPadded ? -1 : leftPadded === rightPadded ? 0 : 1
}
