// Keep an LRU cache of recently-uploaded files for OCR.
// We keep them in IDB to avoid tainted canvas errors after a refresh.
// https://github.com/nolanlawson/pinafore/issues/1901

import { get, set, keys, del } from '../_thirdparty/idb-keyval/idb-keyval'

const PREFIX = 'media-cache-'
const DELIMITER = '-cache-'
const LIMIT = 4 // you can upload 4 images per post, this seems reasonable despite cross-instance usage
export const DELETE_AFTER = 604800000 // 7 days

let deleteAfter = DELETE_AFTER

function keyToData (key) {
  key = key.substring(PREFIX.length)
  const index = key.indexOf(DELIMITER)
  // avoiding str.split() to not have to worry about ids containing the delimiter string somehow
  return [key.substring(0, index), key.substring(index + DELIMITER.length)]
}

function dataToKey (timestamp, id) {
  return `${PREFIX}${timestamp}${DELIMITER}${id}`
}

async function getAllKeys () {
  return (await keys()).filter(key => key.startsWith(PREFIX)).sort()
}

export async function getCachedMediaFile (id) {
  const allKeys = await getAllKeys()

  for (const key of allKeys) {
    const otherId = keyToData(key)[1]
    if (id === otherId) {
      return get(key)
    }
  }
}

export async function setCachedMediaFile (id, file) {
  const allKeys = await getAllKeys()

  if (allKeys.map(keyToData).map(_ => _[1]).includes(id)) {
    return // do nothing, it's already in there
  }

  while (allKeys.length >= LIMIT) {
    // already sorted in chronological order, so delete the oldest
    await del(allKeys.shift())
  }

  // delete anything that's too old, while we're at it
  for (const key of allKeys) {
    const timestamp = keyToData(key)[0]
    if (Date.now() - Date.parse(timestamp) >= deleteAfter) {
      await del(key)
    }
  }

  const key = dataToKey(new Date().toISOString(), id)

  await set(key, file)
}

export async function deleteCachedMediaFile (id) {
  const allKeys = await getAllKeys()

  for (const key of allKeys) {
    const otherId = keyToData(key)[1]
    if (otherId === id) {
      await del(key)
    }
  }
}

// The following are only used in tests

export async function getAllCachedFileIds () {
  return (await getAllKeys()).map(keyToData).map(_ => _[1])
}

export function setDeleteCachedMediaFilesAfter (newDeleteAfter) {
  deleteAfter = newDeleteAfter
}
