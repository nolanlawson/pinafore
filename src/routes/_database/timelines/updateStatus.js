import { dbPromise, getDatabase } from '../databaseLifecycle.js'
import { getInCache, hasInCache, statusesCache } from '../cache.js'
import { STATUSES_STORE } from '../constants.js'
import { cacheStatus } from './cacheStatus.js'
import { putStatus } from './insertion.js'
import { cloneForStorage } from '../helpers.js'

//
// update statuses
//

async function doUpdateStatus (instanceName, statusId, updateFunc) {
  const db = await getDatabase(instanceName)
  if (hasInCache(statusesCache, instanceName, statusId)) {
    const status = getInCache(statusesCache, instanceName, statusId)
    updateFunc(status)
    cacheStatus(status, instanceName)
  }
  return dbPromise(db, STATUSES_STORE, 'readwrite', (statusesStore) => {
    statusesStore.get(statusId).onsuccess = e => {
      const status = e.target.result
      updateFunc(status)
      putStatus(statusesStore, status)
    }
  })
}

export async function setStatusFavorited (instanceName, statusId, favorited) {
  return doUpdateStatus(instanceName, statusId, status => {
    const delta = (favorited ? 1 : 0) - (status.favourited ? 1 : 0)
    status.favourited = favorited
    status.favourites_count = (status.favourites_count || 0) + delta
  })
}

export async function setStatusReblogged (instanceName, statusId, reblogged) {
  return doUpdateStatus(instanceName, statusId, status => {
    const delta = (reblogged ? 1 : 0) - (status.reblogged ? 1 : 0)
    status.reblogged = reblogged
    status.reblogs_count = (status.reblogs_count || 0) + delta
  })
}

export async function setStatusPinned (instanceName, statusId, pinned) {
  return doUpdateStatus(instanceName, statusId, status => {
    status.pinned = pinned
  })
}

export async function setStatusMuted (instanceName, statusId, muted) {
  return doUpdateStatus(instanceName, statusId, status => {
    status.muted = muted
  })
}

export async function setStatusBookmarked (instanceName, statusId, bookmarked) {
  return doUpdateStatus(instanceName, statusId, status => {
    status.bookmarked = bookmarked
  })
}

// For the full list, see https://docs.joinmastodon.org/methods/statuses/#edit
const PROPS_THAT_CAN_BE_EDITED = ['content', 'spoiler_text', 'sensitive', 'language', 'media_ids', 'poll']

export async function updateStatus (instanceName, newStatus) {
  const clonedNewStatus = cloneForStorage(newStatus)
  return doUpdateStatus(instanceName, newStatus.id, status => {
    // We can't use a simple Object.assign() to merge because a prop might have been deleted
    for (const prop of PROPS_THAT_CAN_BE_EDITED) {
      if (!(prop in clonedNewStatus)) {
        delete status[prop]
      } else {
        status[prop] = clonedNewStatus[prop]
      }
    }
  })
}
