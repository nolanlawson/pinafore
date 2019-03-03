/* global describe, it */

import { toPaddedBigInt, toReversePaddedBigInt } from '../../src/routes/_utils/statusIdSorting'
import assert from 'assert'
import times from 'lodash-es/times'

function lt (a, b) {
  assert(a < b, `Failed: ${a} < ${b}`)
}

function gt (a, b) {
  assert(a > b, `Failed: ${a} > ${b}`)
}

describe('test-id-sorting.js', () => {
  it('can sort mastodon IDs correctly', () => {
    let id1 = '1'
    let id2 = '2'
    let id3 = '101687554574502736'
    let id4 = '101688993168288745'
    let id5 = '101689076270570796'

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

  it('can sort mastodon IDs correctly - more examples', () => {
    let ids = times(1000, i => i.toString())

    for (let i = 1; i < ids.length; i++) {
      let prev = ids[i - 1]
      let next = ids[i]
      lt(toPaddedBigInt(prev), toPaddedBigInt(next))
      gt(toReversePaddedBigInt(prev), toReversePaddedBigInt(next))
    }
  })

  it('can sort base62 IDs correctly', () => {
    let id1 = '0'
    let id2 = 'a'
    let id3 = 't'
    let id4 = 'A'
    let id5 = 'Z'

    lt(toPaddedBigInt(id1), toPaddedBigInt(id2))
    lt(toPaddedBigInt(id2), toPaddedBigInt(id3))
    lt(toPaddedBigInt(id3), toPaddedBigInt(id4))
    lt(toPaddedBigInt(id4), toPaddedBigInt(id5))

    lt(toPaddedBigInt(id1), toPaddedBigInt(id5))
    lt(toPaddedBigInt(id2), toPaddedBigInt(id5))
    lt(toPaddedBigInt(id3), toPaddedBigInt(id5))
    lt(toPaddedBigInt(id2), toPaddedBigInt(id4))

    assert.deepStrictEqual(toPaddedBigInt(id1), toPaddedBigInt(id1))
    assert.deepStrictEqual(toPaddedBigInt(id2), toPaddedBigInt(id2))
    assert.deepStrictEqual(toPaddedBigInt(id3), toPaddedBigInt(id3))
    assert.deepStrictEqual(toPaddedBigInt(id4), toPaddedBigInt(id4))
    assert.deepStrictEqual(toPaddedBigInt(id5), toPaddedBigInt(id5))

    gt(toReversePaddedBigInt(id1), toReversePaddedBigInt(id2))
    gt(toReversePaddedBigInt(id2), toReversePaddedBigInt(id3))
    gt(toReversePaddedBigInt(id3), toReversePaddedBigInt(id4))
    gt(toReversePaddedBigInt(id4), toReversePaddedBigInt(id5))

    gt(toReversePaddedBigInt(id1), toReversePaddedBigInt(id5))
    gt(toReversePaddedBigInt(id2), toReversePaddedBigInt(id5))
    gt(toReversePaddedBigInt(id3), toReversePaddedBigInt(id5))
    gt(toReversePaddedBigInt(id2), toReversePaddedBigInt(id4))

    assert.deepStrictEqual(toReversePaddedBigInt(id1), toReversePaddedBigInt(id1))
    assert.deepStrictEqual(toReversePaddedBigInt(id2), toReversePaddedBigInt(id2))
    assert.deepStrictEqual(toReversePaddedBigInt(id3), toReversePaddedBigInt(id3))
    assert.deepStrictEqual(toReversePaddedBigInt(id4), toReversePaddedBigInt(id4))
    assert.deepStrictEqual(toReversePaddedBigInt(id5), toReversePaddedBigInt(id5))
  })

  it('can sort pleroma ids - more examples', () => {
    // these are already in base62 sorted order
    let ids = [
      '9gP7cpqqJWyp93GxRw',
      '9gP7p4Ng7RdTgOSsro',
      '9gP8eQQFvdZgoQ9tw0',
      '9gP8XTjVDpsT3Iqgb2',
      '9gP99enEY6IAMJnaXA',
      '9gP9WIcp8QCIGbj6ES',
      '9gPA897muEuxo0FxCa',
      '9gPAaSqTB8Rv4nev0C',
      '9gPAhfTCdeRCG5D9IO',
      '9gPAG1uvaSBblj05Y0',
      '9gPBatpwvN76kABf7Y',
      '9gPBA9SYjPFVNUUZTU',
      '9gPBOzteZJZO3wFCQy',
      '9gPC7jAtaS1vEQdcnY',
      '9gPC9Ps4KQMLwRdZWy',
      '9gPCF0G8SvCKFHYg52',
      '9gPCJoNY42C4qZJo0W',
      '9gPEBGmBJX3YDntYBM',
      '9gPELIqcT0BhXgksSG',
      '9gPISh6j4FMCcu4Js0'
    ]

    for (let i = 1; i < ids.length; i++) {
      let prev = ids[i - 1]
      let next = ids[i]
      lt(toPaddedBigInt(prev), toPaddedBigInt(next))
      gt(toReversePaddedBigInt(prev), toReversePaddedBigInt(next))
    }
  })
})
