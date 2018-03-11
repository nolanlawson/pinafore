import difference from 'lodash/difference'
import times from 'lodash/times'
import { cloneForStorage } from './helpers'
import { dbPromise, getDatabase } from './databaseLifecycle'
import {
  accountsCache, deleteFromCache, getInCache, hasInCache, notificationsCache, setInCache,
  statusesCache
} from './cache'
import { scheduleCleanup } from './cleanup'
import {
  ACCOUNTS_STORE,
  NOTIFICATION_TIMELINES_STORE,
  NOTIFICATIONS_STORE, PINNED_STATUSES_STORE,
  STATUS_TIMELINES_STORE,
  STATUSES_STORE,
  ACCOUNT_ID,
  REBLOG_ID,
  STATUS_ID, THREADS_STORE
} from './constants'
import {
  createThreadKeyRange,
  createTimelineKeyRange,
  createTimelineId,
  createThreadId,
  createPinnedStatusKeyRange,
  createPinnedStatusId
} from './keys'
import { deleteAll } from './utils'

function cacheStatus (status, instanceName) {
  setInCache(statusesCache, instanceName, status.id, status)
  setInCache(accountsCache, instanceName, status.account.id, status.account)
  if (status.reblog) {
    setInCache(accountsCache, instanceName, status.reblog.account.id, status.reblog.account)
  }
}

//
// pagination
//

async function getNotificationTimeline (instanceName, timeline, maxId, limit) {
  let storeNames = [NOTIFICATION_TIMELINES_STORE, NOTIFICATIONS_STORE, STATUSES_STORE, ACCOUNTS_STORE]
  const db = await getDatabase(instanceName)
  return dbPromise(db, storeNames, 'readonly', (stores, callback) => {
    let [ timelineStore, notificationsStore, statusesStore, accountsStore ] = stores
    let keyRange = createTimelineKeyRange(timeline, maxId)

    timelineStore.getAll(keyRange, limit).onsuccess = e => {
      let timelineResults = e.target.result
      let res = new Array(timelineResults.length)
      timelineResults.forEach((notificationId, i) => {
        fetchNotification(notificationsStore, statusesStore, accountsStore, notificationId, notification => {
          res[i] = notification
        })
      })
      callback(res)
    }
  })
}

async function getStatusTimeline (instanceName, timeline, maxId, limit) {
  let storeNames = [STATUS_TIMELINES_STORE, STATUSES_STORE, ACCOUNTS_STORE]
  const db = await getDatabase(instanceName)
  return dbPromise(db, storeNames, 'readonly', (stores, callback) => {
    let [ timelineStore, statusesStore, accountsStore ] = stores
    let getReq = timelineStore.getAll(createTimelineKeyRange(timeline, maxId), limit)
    getReq.onsuccess = e => {
      let timelineResults = e.target.result
      let res = new Array(timelineResults.length)
      timelineResults.forEach((statusId, i) => {
        fetchStatus(statusesStore, accountsStore, statusId, status => {
          res[i] = status
        })
      })
      callback(res)
    }
  })
}

async function getStatusThread (instanceName, statusId) {
  let storeNames = [THREADS_STORE, STATUSES_STORE, ACCOUNTS_STORE]
  const db = await getDatabase(instanceName)
  return dbPromise(db, storeNames, 'readonly', (stores, callback) => {
    let [ threadsStore, statusesStore, accountsStore ] = stores
    let keyRange = createThreadKeyRange(statusId)
    threadsStore.getAll(keyRange).onsuccess = e => {
      let thread = e.target.result
      let res = new Array(thread.length)
      thread.forEach((otherStatusId, i) => {
        fetchStatus(statusesStore, accountsStore, otherStatusId, status => {
          res[i] = status
        })
      })
      callback(res)
    }
  })
}

export async function getTimeline (instanceName, timeline, maxId = null, limit = 20) {
  if (timeline === 'notifications') {
    return getNotificationTimeline(instanceName, timeline, maxId, limit)
  } else if (timeline.startsWith('status/')) {
    let statusId = timeline.split('/').slice(-1)[0]
    return getStatusThread(instanceName, statusId)
  } else {
    return getStatusTimeline(instanceName, timeline, maxId, limit)
  }
}

//
// insertion
//

function putStatus (statusesStore, status) {
  statusesStore.put(cloneForStorage(status))
}

function putAccount (accountsStore, account) {
  accountsStore.put(cloneForStorage(account))
}

function putNotification (notificationsStore, notification) {
  notificationsStore.put(cloneForStorage(notification))
}

function storeAccount (accountsStore, account) {
  putAccount(accountsStore, account)
}

function storeStatus (statusesStore, accountsStore, status) {
  putStatus(statusesStore, status)
  putAccount(accountsStore, status.account)
  if (status.reblog) {
    putStatus(statusesStore, status.reblog)
    putAccount(accountsStore, status.reblog.account)
  }
}

function storeNotification (notificationsStore, statusesStore, accountsStore, notification) {
  if (notification.status) {
    storeStatus(statusesStore, accountsStore, notification.status)
  }
  storeAccount(accountsStore, notification.account)
  putNotification(notificationsStore, notification)
}

function fetchAccount (accountsStore, id, callback) {
  accountsStore.get(id).onsuccess = e => {
    callback(e.target.result)
  }
}

function fetchStatus (statusesStore, accountsStore, id, callback) {
  statusesStore.get(id).onsuccess = e => {
    let status = e.target.result
    callback(status)
    fetchAccount(accountsStore, status[ACCOUNT_ID], account => {
      status.account = account
    })
    if (status[REBLOG_ID]) {
      fetchStatus(statusesStore, accountsStore, status[REBLOG_ID], reblog => {
        status.reblog = reblog
      })
    }
  }
}

function fetchNotification (notificationsStore, statusesStore, accountsStore, id, callback) {
  notificationsStore.get(id).onsuccess = e => {
    let notification = e.target.result
    callback(notification)
    fetchAccount(accountsStore, notification[ACCOUNT_ID], account => {
      notification.account = account
    })
    if (notification[STATUS_ID]) {
      fetchStatus(statusesStore, accountsStore, notification[STATUS_ID], status => {
        notification.status = status
      })
    }
  }
}

async function insertTimelineNotifications (instanceName, timeline, notifications) {
  for (let notification of notifications) {
    setInCache(notificationsCache, instanceName, notification.id, notification)
    setInCache(accountsCache, instanceName, notification.account.id, notification.account)
    if (notification.status) {
      setInCache(statusesCache, instanceName, notification.status.id, notification.status)
    }
  }
  const db = await getDatabase(instanceName)
  let storeNames = [NOTIFICATION_TIMELINES_STORE, NOTIFICATIONS_STORE, ACCOUNTS_STORE, STATUSES_STORE]
  await dbPromise(db, storeNames, 'readwrite', (stores) => {
    let [ timelineStore, notificationsStore, accountsStore, statusesStore ] = stores
    for (let notification of notifications) {
      storeNotification(notificationsStore, statusesStore, accountsStore, notification)
      timelineStore.put(notification.id, createTimelineId(timeline, notification.id))
    }
  })
}

async function insertTimelineStatuses (instanceName, timeline, statuses) {
  for (let status of statuses) {
    cacheStatus(status, instanceName)
  }
  const db = await getDatabase(instanceName)
  let storeNames = [STATUS_TIMELINES_STORE, STATUSES_STORE, ACCOUNTS_STORE]
  await dbPromise(db, storeNames, 'readwrite', (stores) => {
    let [ timelineStore, statusesStore, accountsStore ] = stores
    for (let status of statuses) {
      storeStatus(statusesStore, accountsStore, status)
      timelineStore.put(status.id, createTimelineId(timeline, status.id))
    }
  })
}

async function insertStatusThread (instanceName, statusId, statuses) {
  for (let status of statuses) {
    cacheStatus(status, instanceName)
  }
  const db = await getDatabase(instanceName)
  let storeNames = [THREADS_STORE, STATUSES_STORE, ACCOUNTS_STORE]
  await dbPromise(db, storeNames, 'readwrite', (stores) => {
    let [ threadsStore, statusesStore, accountsStore ] = stores
    threadsStore.getAllKeys(createThreadKeyRange(statusId)).onsuccess = e => {
      let existingKeys = e.target.result
      let newKeys = times(statuses.length, i => createThreadId(statusId, i))
      let keysToDelete = difference(existingKeys, newKeys)
      for (let key of keysToDelete) {
        threadsStore.delete(key)
      }
    }
    statuses.forEach((otherStatus, i) => {
      storeStatus(statusesStore, accountsStore, otherStatus)
      threadsStore.put(otherStatus.id, createThreadId(statusId, i))
    })
  })
}

export async function insertTimelineItems (instanceName, timeline, timelineItems) {
  /* no await */ scheduleCleanup()
  if (timeline === 'notifications') {
    return insertTimelineNotifications(instanceName, timeline, timelineItems)
  } else if (timeline.startsWith('status/')) {
    let statusId = timeline.split('/').slice(-1)[0]
    return insertStatusThread(instanceName, statusId, timelineItems)
  } else {
    return insertTimelineStatuses(instanceName, timeline, timelineItems)
  }
}

//
// get
//

export async function getStatus (instanceName, id) {
  if (hasInCache(statusesCache, instanceName, id)) {
    return getInCache(statusesCache, instanceName, id)
  }
  const db = await getDatabase(instanceName)
  let storeNames = [STATUSES_STORE, ACCOUNTS_STORE]
  let result = await dbPromise(db, storeNames, 'readonly', (stores, callback) => {
    let [ statusesStore, accountsStore ] = stores
    fetchStatus(statusesStore, accountsStore, id, callback)
  })
  setInCache(statusesCache, instanceName, id, result)
  return result
}

export async function getNotification (instanceName, id) {
  if (hasInCache(notificationsCache, instanceName, id)) {
    return getInCache(notificationsCache, instanceName, id)
  }
  const db = await getDatabase(instanceName)
  let storeNames = [NOTIFICATIONS_STORE, STATUSES_STORE, ACCOUNTS_STORE]
  let result = await dbPromise(db, storeNames, 'readonly', (stores, callback) => {
    let [ notificationsStore, statusesStore, accountsStore ] = stores
    fetchNotification(notificationsStore, statusesStore, accountsStore, id, callback)
  })
  setInCache(notificationsCache, instanceName, id, result)
  return result
}

//
// lookup by reblogs
//

export async function getReblogsForStatus (instanceName, id) {
  const db = await getDatabase(instanceName)
  await dbPromise(db, STATUSES_STORE, 'readonly', (statusesStore, callback) => {
    statusesStore.index(REBLOG_ID).getAll(IDBKeyRange.only(id)).onsuccess = e => {
      callback(e.target.result)
    }
  })
}

//
// lookups by statusId
//

export async function getNotificationIdsForStatuses (instanceName, statusIds) {
  const db = await getDatabase(instanceName)
  await dbPromise(db, NOTIFICATIONS_STORE, 'readonly', (notificationsStore, callback) => {
    let res = []
    callback(res)
    statusIds.forEach(statusId => {
      let req = notificationsStore.index(STATUS_ID).getAllKeys(IDBKeyRange.only(statusId))
      req.onsuccess = e => {
        res = res.concat(e.target.result)
      }
    })
  })
}

//
// deletes
//

export async function deleteStatusesAndNotifications (instanceName, statusIds, notificationIds) {
  for (let statusId of statusIds) {
    deleteFromCache(statusesCache, instanceName, statusId)
  }
  for (let notificationId of notificationIds) {
    deleteFromCache(notificationsCache, instanceName, notificationId)
  }
  const db = await getDatabase(instanceName)
  let storeNames = [
    STATUSES_STORE,
    STATUS_TIMELINES_STORE,
    NOTIFICATIONS_STORE,
    NOTIFICATION_TIMELINES_STORE,
    PINNED_STATUSES_STORE,
    THREADS_STORE
  ]
  await dbPromise(db, storeNames, 'readwrite', (stores) => {
    let [
      statusesStore,
      statusTimelinesStore,
      notificationsStore,
      notificationTimelinesStore,
      pinnedStatusesStore,
      threadsStore
    ] = stores

    function deleteStatus (statusId) {
      statusesStore.delete(statusId)
      deleteAll(
        pinnedStatusesStore,
        pinnedStatusesStore.index('statusId'),
        IDBKeyRange.only(statusId)
      )
      deleteAll(
        statusTimelinesStore,
        statusTimelinesStore.index('statusId'),
        IDBKeyRange.only(statusId)
      )
      deleteAll(
        threadsStore,
        threadsStore.index('statusId'),
        IDBKeyRange.only(statusId)
      )
      deleteAll(
        threadsStore,
        threadsStore,
        createThreadKeyRange(statusId)
      )
    }

    function deleteNotification (notificationId) {
      notificationsStore.delete(notificationId)
      deleteAll(
        notificationTimelinesStore,
        notificationTimelinesStore.index('statusId'),
        IDBKeyRange.only(notificationId)
      )
    }

    for (let statusId of statusIds) {
      deleteStatus(statusId)
    }
    for (let notificationId of notificationIds) {
      deleteNotification(notificationId)
    }
  })
}

//
// pinned statuses
//

export async function insertPinnedStatuses (instanceName, accountId, statuses) {
  for (let status of statuses) {
    cacheStatus(status, instanceName)
  }
  const db = await getDatabase(instanceName)
  let storeNames = [PINNED_STATUSES_STORE, STATUSES_STORE, ACCOUNTS_STORE]
  await dbPromise(db, storeNames, 'readwrite', (stores) => {
    let [ pinnedStatusesStore, statusesStore, accountsStore ] = stores
    statuses.forEach((status, i) => {
      storeStatus(statusesStore, accountsStore, status)
      pinnedStatusesStore.put(status.id, createPinnedStatusId(accountId, i))
    })
  })
}

export async function getPinnedStatuses (instanceName, accountId) {
  let storeNames = [PINNED_STATUSES_STORE, STATUSES_STORE, ACCOUNTS_STORE]
  const db = await getDatabase(instanceName)
  return dbPromise(db, storeNames, 'readonly', (stores, callback) => {
    let [ pinnedStatusesStore, statusesStore, accountsStore ] = stores
    let keyRange = createPinnedStatusKeyRange(accountId)
    pinnedStatusesStore.getAll(keyRange).onsuccess = e => {
      let pinnedResults = e.target.result
      let res = new Array(pinnedResults.length)
      pinnedResults.forEach((statusId, i) => {
        fetchStatus(statusesStore, accountsStore, statusId, status => {
          res[i] = status
        })
      })
      callback(res)
    }
  })
}

//
// update statuses
//

async function updateStatus (instanceName, statusId, updateFunc) {
  const db = await getDatabase(instanceName)
  if (hasInCache(statusesCache, instanceName, statusId)) {
    let status = getInCache(statusesCache, instanceName, statusId)
    updateFunc(status)
    cacheStatus(status, instanceName)
  }
  return dbPromise(db, STATUSES_STORE, 'readwrite', (statusesStore) => {
    statusesStore.get(statusId).onsuccess = e => {
      let status = e.target.result
      updateFunc(status)
      putStatus(statusesStore, status)
    }
  })
}

export async function setStatusFavorited (instanceName, statusId, favorited) {
  return updateStatus(instanceName, statusId, status => {
    let delta = (favorited ? 1 : 0) - (status.favourited ? 1 : 0)
    status.favourited = favorited
    status.favourites_count = (status.favourites_count || 0) + delta
  })
}

export async function setStatusReblogged (instanceName, statusId, reblogged) {
  return updateStatus(instanceName, statusId, status => {
    let delta = (reblogged ? 1 : 0) - (status.reblogged ? 1 : 0)
    status.reblogged = reblogged
    status.reblogs_count = (status.reblogs_count || 0) + delta
  })
}
