import { dbPromise, getDatabase } from '../databaseLifecycle'
import { getInCache, hasInCache, statusesCache } from '../cache'
import { STATUSES_STORE } from '../constants'
import { cacheStatus } from './cacheStatus'
import { putStatus } from './insertion'

//
// update statuses
//

async function updateStatus (instanceName, statusId, updateFunc) {
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
  return updateStatus(instanceName, statusId, status => {
    const delta = (favorited ? 1 : 0) - (status.favourited ? 1 : 0)
    status.favourited = favorited
    status.favourites_count = (status.favourites_count || 0) + delta
  })
}

export async function setStatusReblogged (instanceName, statusId, reblogged) {
  return updateStatus(instanceName, statusId, status => {
    const delta = (reblogged ? 1 : 0) - (status.reblogged ? 1 : 0)
    status.reblogged = reblogged
    status.reblogs_count = (status.reblogs_count || 0) + delta
  })
}

export async function setStatusPinned (instanceName, statusId, pinned) {
  return updateStatus(instanceName, statusId, status => {
    status.pinned = pinned
  })
}

export async function setStatusMuted (instanceName, statusId, muted) {
  return updateStatus(instanceName, statusId, status => {
    status.muted = muted
  })
}

export async function setStatusBookmarked (instanceName, statusId, bookmarked) {
  return updateStatus(instanceName, statusId, status => {
    status.bookmarked = bookmarked
  })
}
