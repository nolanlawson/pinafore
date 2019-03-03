/* global describe, it */

import { toPaddedBigInt, toReversePaddedBigInt } from '../../src/routes/_utils/sorting'
import assert from 'assert'

function lt(a, b) {
  assert(a < b, `Failed: ${a} < ${b}`)
}

function gt(a, b) {
  assert(a > b, `Failed: ${a} < ${b}`)
}

describe('test-sorting.js', () => {
  it('can sort mastodon IDs correctly', () => {
    let id1 = "1"
    let id2 = "2"
    let id3 = "101687554574502736"
    let id4 = "101688993168288745"
    let id5 = "101689076270570796"

    lt(toPaddedBigInt(id1), toPaddedBigInt(id2))
    lt(toPaddedBigInt(id2), toPaddedBigInt(id3))
    lt(toPaddedBigInt(id3), toPaddedBigInt(id4))
    lt(toPaddedBigInt(id4), toPaddedBigInt(id5))

    assert.deepStrictEqual(toPaddedBigInt(id1), toPaddedBigInt(id1))
    assert.deepStrictEqual(toPaddedBigInt(id2), toPaddedBigInt(id2))
    assert.deepStrictEqual(toPaddedBigInt(id3), toPaddedBigInt(id3))
    assert.deepStrictEqual(toPaddedBigInt(id4), toPaddedBigInt(id4))
    assert.deepStrictEqual(toPaddedBigInt(id5), toPaddedBigInt(id5))

    gt(toReversePaddedBigInt(id1), toReversePaddedBigInt(id2))
    gt(toReversePaddedBigInt(id2), toReversePaddedBigInt(id3))
    gt(toReversePaddedBigInt(id3), toReversePaddedBigInt(id4))
    gt(toReversePaddedBigInt(id4), toReversePaddedBigInt(id5))

    assert.deepStrictEqual(toReversePaddedBigInt(id1), toReversePaddedBigInt(id1))
    assert.deepStrictEqual(toReversePaddedBigInt(id2), toReversePaddedBigInt(id2))
    assert.deepStrictEqual(toReversePaddedBigInt(id3), toReversePaddedBigInt(id3))
    assert.deepStrictEqual(toReversePaddedBigInt(id4), toReversePaddedBigInt(id4))
    assert.deepStrictEqual(toReversePaddedBigInt(id5), toReversePaddedBigInt(id5))
  })
})
