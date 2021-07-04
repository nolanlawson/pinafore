/* global describe, it */

import { toPaddedBigInt, toReversePaddedBigInt } from '../../src/routes/_utils/statusIdSorting.js'
import assert from 'assert'
import { times } from '../../src/routes/_utils/lodash-lite.js'

function lt (a, b) {
  assert(a < b, `Failed: ${a} < ${b}`)
}

function gt (a, b) {
  assert(a > b, `Failed: ${a} > ${b}`)
}

describe('test-id-sorting.js', () => {
  it('basic id sorting', () => {
    assert.deepStrictEqual(toPaddedBigInt('0'), '000000000000000000000000000000')
    assert.deepStrictEqual(toPaddedBigInt('1'), '000000000000000000000000000001')
    assert.deepStrictEqual(toPaddedBigInt('z'), '00000000000000000000000000000z')
    assert.deepStrictEqual(toReversePaddedBigInt('0'), 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzz')
    assert.deepStrictEqual(toReversePaddedBigInt('1'), 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzy')
    assert.deepStrictEqual(toReversePaddedBigInt('z'), 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzz0')
  })

  it('can sort mastodon IDs correctly', () => {
    const id1 = '1'
    const id2 = '2'
    const id3 = '101687554574502736'
    const id4 = '101688993168288745'
    const id5 = '101689076270570796'

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
    const ids = times(1000, i => i.toString())

    for (let i = 1; i < ids.length; i++) {
      const prev = ids[i - 1]
      const next = ids[i]
      lt(toPaddedBigInt(prev), toPaddedBigInt(next))
      gt(toReversePaddedBigInt(prev), toReversePaddedBigInt(next))
    }
  })

  it('can sort base62 IDs correctly', () => {
    const id1 = '0'
    const id2 = 'A'
    const id3 = 'Z'
    const id4 = 'a'
    const id5 = 't'

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

  it('can sort base62 IDs correctly 2', () => {
    const id1 = '0'
    const id2 = 'A'
    const id3 = 'T'
    const id4 = 'a'
    const id5 = 'z'

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

  it('can sort base62 IDs correctly 3', () => {
    const id1 = 'a'
    const id2 = 'z'
    const id3 = 'a0'
    const id4 = 'xx0'
    const id5 = 'a000'

    lt(toPaddedBigInt(id1), toPaddedBigInt(id2))
    lt(toPaddedBigInt(id2), toPaddedBigInt(id3))
    lt(toPaddedBigInt(id3), toPaddedBigInt(id4))
    lt(toPaddedBigInt(id4), toPaddedBigInt(id5))

    lt(toPaddedBigInt(id1), toPaddedBigInt(id5))
    lt(toPaddedBigInt(id2), toPaddedBigInt(id5))
    lt(toPaddedBigInt(id3), toPaddedBigInt(id5))
    lt(toPaddedBigInt(id2), toPaddedBigInt(id4))

    gt(toReversePaddedBigInt(id1), toReversePaddedBigInt(id2))
    gt(toReversePaddedBigInt(id2), toReversePaddedBigInt(id3))
    gt(toReversePaddedBigInt(id3), toReversePaddedBigInt(id4))
    gt(toReversePaddedBigInt(id4), toReversePaddedBigInt(id5))

    gt(toReversePaddedBigInt(id1), toReversePaddedBigInt(id5))
    gt(toReversePaddedBigInt(id2), toReversePaddedBigInt(id5))
    gt(toReversePaddedBigInt(id3), toReversePaddedBigInt(id5))
    gt(toReversePaddedBigInt(id2), toReversePaddedBigInt(id4))
  })

  it('can sort pleroma ids', () => {
    // these are already in base62 sorted order
    const ids = [
      '9gP7cpqqJWyp93GxRw',
      '9gP7p4Ng7RdTgOSsro',
      '9gP8XTjVDpsT3Iqgb2',
      '9gP8eQQFvdZgoQ9tw0',
      '9gP99enEY6IAMJnaXA',
      '9gP9WIcp8QCIGbj6ES',
      '9gPA897muEuxo0FxCa',
      '9gPAG1uvaSBblj05Y0',
      '9gPAaSqTB8Rv4nev0C',
      '9gPAhfTCdeRCG5D9IO',
      '9gPBA9SYjPFVNUUZTU',
      '9gPBOzteZJZO3wFCQy',
      '9gPBatpwvN76kABf7Y',
      '9gPC7jAtaS1vEQdcnY',
      '9gPC9Ps4KQMLwRdZWy',
      '9gPCF0G8SvCKFHYg52',
      '9gPCJoNY42C4qZJo0W',
      '9gPEBGmBJX3YDntYBM',
      '9gPELIqcT0BhXgksSG',
      '9gPISh6j4FMCcu4Js0'
    ]

    for (let i = 1; i < ids.length; i++) {
      const prev = ids[i - 1]
      const next = ids[i]
      lt(toPaddedBigInt(prev), toPaddedBigInt(next))
      gt(toReversePaddedBigInt(prev), toReversePaddedBigInt(next))
    }
  })

  it('can sort pleroma ids 2', () => {
    const ids = [
      '9gTv5mTEiXL6ZpqYHg',
      '9gTv5mK1Gny07FXBuy',
      '9gTv5kXlshmKbJx94i',
      '9gTv5f9TvaNVsXYB1M',
      '9gTv5Fj2SlN71HzCpk',
      '9gTv5DibvNqCnNlptA',
      '9gTv4ttvbb0hKguaki',
      '9gTv4n17CTbFyxDjU0',
      '9gTv43wGndzCAtbjBQ',
      '9gTv3zP9ep7W725E0m',
      '9gTv3mQRuhQnrHaZiy',
      '9gTv3mOK2bjJkgasPQ',
      '9gTv3kpXqQJiuXJaYy',
      '9gTv3JliSYDAyqJeLY',
      '9gTv36jSvbgeY6AAXA',
      '9gTv2udLuVfP1fD7L6',
      '9gTv2gbQ4tnnVcCNNo',
      '9gTv2FSH0nRXJQiBsW',
      '9gTv1tfzz5LllcxqDY',
      '9gTv1t1EQejxjBtHfs'
    ].reverse()

    for (let i = 1; i < ids.length; i++) {
      const prev = ids[i - 1]
      const next = ids[i]
      lt(toPaddedBigInt(prev), toPaddedBigInt(next))
      gt(toReversePaddedBigInt(prev), toReversePaddedBigInt(next))
    }
  })

  it('can sort pleroma ids - 3', () => {
    const ids = [
      '9gTCUO2xe7vfkLbHRA',
      '9gT35b559J1tLPhGj2',
      '9gRax4YxAwDuIdr83U',
      '9gQqktJiZ6ha3Tz0fA',
      '9gOyRmT0DkfWcmnw7k',
      '9gOvJd0nBsvd7a1wUy',
      '9gOsyLgqCKARPQQKPo',
      '9gOsiEkAFyEnERINOq',
      '9gOsHBDvEh0EUoJRom',
      '9gOrx9MURrsivilkjw',
      '9gOrpQWsjga3rEwmw4',
      '9gOriOTFzUcLRjtjkm',
      '9gOraOfrLpz3lBynXE',
      '9gOrLvdMWe0Ldgudbk',
      '9gOrB5vttTXiOaPxCq',
      '9gOpJz8uJEGa2Ac47E',
      '9gOhCP31JNzWQXjVEu',
      '9gOdCdne43SIMZOp8K',
      '9gOcJKlz6VfvQRFZyq',
      '9gOcGtLW6bmXmchoGG',
      '9gOc78e2N27GKriYdM',
      '9gOc4BmYFXBvCHIGzw',
      '9gObs3Wx6Rt888DCHQ',
      '9gObp0SU4J0tjXfSZk',
      '9gOaaY4UiJOngVzN6e',
      '9gOaAiTbPDbQQTPnpQ',
      '9gOZjQH0yaB29SVrIe',
      '9gOZTFEsEbV1IMnUDA',
      '9gOZQA9yf55sfs2NYu',
      '9gOZNK8p5vaulK8yKO',
      '9gOZMvOZ6GKe0uJgtU',
      '9gOZIXp4ndv9kMd1SC',
      '9gOWmmfFsr2obOlJuy',
      '9gOWivHDvAoO9egFmK',
      '9gOWZDwXfIAH9TNkbQ',
      '9gOWUUUkhMq92R7v6m',
      '9gOWChzRml0fgE0MJk',
      '9gOVO8G0MitkNRdIjw',
      '9gNEd8FWme8oJn15Jg',
      '9gNEUoR2ZKkgY4Qzce'
    ].reverse()

    for (let i = 1; i < ids.length; i++) {
      const prev = ids[i - 1]
      const next = ids[i]
      lt(toPaddedBigInt(prev), toPaddedBigInt(next))
      gt(toReversePaddedBigInt(prev), toReversePaddedBigInt(next))
    }
  })
})
