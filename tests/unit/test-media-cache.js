/* global it describe beforeEach */

import '../indexedDBShims'
import assert from 'assert'
import {
  getCachedMediaFile, setCachedMediaFile, deleteCachedMediaFile, getAllCachedFileIds, setDeleteCachedMediaFilesAfter, DELETE_AFTER
} from '../../src/routes/_database/mediaUploadFileCache'

describe('test-database.js', function () {
  this.timeout(60000)

  beforeEach(async () => {
    for (const key of await getAllCachedFileIds()) {
      await deleteCachedMediaFile(key)
    }
    setDeleteCachedMediaFilesAfter(DELETE_AFTER)
  })

  it('can store media files', async () => {
    await setCachedMediaFile('woot', 'woot')
    const result = await getCachedMediaFile('woot')
    assert.deepStrictEqual(result, 'woot')
    await deleteCachedMediaFile('woot')
    const result2 = await getCachedMediaFile('woot')
    assert.deepStrictEqual(result2, undefined)
  })

  it('does nothing if you set() the same id twice', async () => {
    await setCachedMediaFile('woot', 'woot')
    await setCachedMediaFile('woot', 'woot2')
    const result = await getCachedMediaFile('woot')
    assert.deepStrictEqual(result, 'woot')
  })

  it('returns undefined if not found', async () => {
    const result = await getCachedMediaFile('woot')
    assert.deepStrictEqual(result, undefined)
  })

  it('does nothing when deleting an unfound key', async () => {
    await deleteCachedMediaFile('doesnt-exist')
  })

  it('only stores up to 4 files', async () => {
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 4)) // delay to avoid timing collisions
      await setCachedMediaFile(i.toString(), i)
    }
    const ids = await getAllCachedFileIds()
    assert.deepStrictEqual(ids, [6, 7, 8, 9].map(_ => _.toString()))
  })

  it('deletes old files during set()', async () => {
    setDeleteCachedMediaFilesAfter(0)
    await setCachedMediaFile('woot', 'woot')
    await setCachedMediaFile('woot2', 'woot2')
    assert.deepStrictEqual(await getCachedMediaFile('woot'), undefined)
    assert.deepStrictEqual(await getCachedMediaFile('woot2'), 'woot2')
  })
})
