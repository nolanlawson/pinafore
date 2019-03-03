import padStart from 'lodash-es/padStart'

export function zeroPad (str, toSize) {
  return padStart(str, toSize, '0')
}

export function toPaddedBigInt (id) {
  return zeroPad(id, 30)
}

export function toReversePaddedBigInt (id) {
  let bigInt = toPaddedBigInt(id)
  let res = ''
  for (let i = 0; i < bigInt.length; i++) {
    res += (9 - parseInt(bigInt.charAt(i), 10)).toString(10)
  }
  return res
}

export function compareTimelineItemSummaries (left, right) {
  let leftPadded = toPaddedBigInt(left.id)
  let rightPadded = toPaddedBigInt(right.id)
  return leftPadded < rightPadded ? -1 : leftPadded === rightPadded ? 0 : 1
}
