import { toReversePaddedBigInt } from './utils'
import { dbPromise, getDatabase } from './databaseLifecycle'
import { accountsCache, getInCache, hasInCache, notificationsCache, setInCache, statusesCache } from './cache'
import {
  ACCOUNTS_STORE,
  NOTIFICATION_TIMELINES_STORE,
  NOTIFICATIONS_STORE,
  STATUS_TIMELINES_STORE,
  STATUSES_STORE
} from './constants'

const TIMESTAMP = '__pinafore_ts'
const ACCOUNT_ID = '__pinafore_acct_id'
const STATUS_ID = '__pinafore_status_id'
const REBLOG_ID = '__pinafore_reblog_id'

function createTimelineKeyRange (timeline, maxId) {
  let negBigInt = maxId && toReversePaddedBigInt(maxId)
  let start = negBigInt ? (timeline + '\u0000' + negBigInt) : (timeline + '\u0000')
  let end = timeline + '\u0000\uffff'
  return IDBKeyRange.bound(start, end, true, true)
}

// special case for threads – these are in chronological order rather than reverse
// chronological order, and we fetch everything all at once rather than paginating
function createKeyRangeForStatusThread (timeline) {
  let start = timeline + '\u0000'
  let end = timeline + '\u0000\uffff'
  return IDBKeyRange.bound(start, end, true, true)
}

function cloneForStorage (obj) {
  let res = {}
  let keys = Object.keys(obj)
  for (let key of keys) {
    let value = obj[key]
    // save storage space by skipping nulls, 0s, falses, empty strings, and empty arrays
    if (!value || (Array.isArray(value) && value.length === 0)) {
      continue
    }
    switch (key) {
      case 'account':
        res[ACCOUNT_ID] = value.id
        break
      case 'status':
        res[STATUS_ID] = value.id
        break
      case 'reblog':
        res[REBLOG_ID] = value.id
        break
      default:
        res[key] = value
        break
    }
  }
  res[TIMESTAMP] = Date.now()
  return res
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
      timelineResults.forEach((timelineResult, i) => {
        fetchNotification(notificationsStore, statusesStore, accountsStore, timelineResult.notificationId, notification => {
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
    // Status threads are a special case - these are in forward chronological order
    // and we fetch them all at once instead of paginating.
    let isStatusThread = timeline.startsWith('status/')
    let getReq = isStatusThread
      ? timelineStore.getAll(createKeyRangeForStatusThread(timeline))
      : timelineStore.getAll(createTimelineKeyRange(timeline, maxId), limit)

    getReq.onsuccess = e => {
      let timelineResults = e.target.result
      if (isStatusThread) {
        timelineResults = timelineResults.reverse()
      }
      let res = new Array(timelineResults.length)
      timelineResults.forEach((timelineResult, i) => {
        fetchStatus(statusesStore, accountsStore, timelineResult.statusId, status => {
          res[i] = status
        })
      })
      callback(res)
    }
  })
}

export async function getTimeline (instanceName, timeline, maxId = null, limit = 20) {
  return timeline === 'notifications'
    ? getNotificationTimeline(instanceName, timeline, maxId, limit)
    : getStatusTimeline(instanceName, timeline, maxId, limit)
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

function createTimelineId (timeline, id) {
  // reverse chronological order, prefixed by timeline
  return timeline + '\u0000' + toReversePaddedBigInt(id)
}

async function insertTimelineNotifications (instanceName, timeline, notifications) {
  for (let notification of notifications) {
    setInCache(notificationsCache, instanceName, notification.id, notification)
    setInCache(accountsCache, instanceName, notification.account.id, notification.account)
  }
  const db = await getDatabase(instanceName)
  let storeNames = [NOTIFICATION_TIMELINES_STORE, NOTIFICATIONS_STORE, ACCOUNTS_STORE, STATUSES_STORE]
  await dbPromise(db, storeNames, 'readwrite', (stores) => {
    let [ timelineStore, notificationsStore, accountsStore, statusesStore ] = stores
    for (let notification of notifications) {
      storeNotification(notificationsStore, statusesStore, accountsStore, notification)
      timelineStore.put({
        id: createTimelineId(timeline, notification.id),
        notificationId: notification.id
      })
    }
  })
}

async function insertTimelineStatuses (instanceName, timeline, statuses) {
  for (let status of statuses) {
    setInCache(statusesCache, instanceName, status.id, status)
    setInCache(accountsCache, instanceName, status.account.id, status.account)
    if (status.reblog) {
      setInCache(accountsCache, instanceName, status.reblog.account.id, status.reblog.account)
    }
  }
  const db = await getDatabase(instanceName)
  let storeNames = [STATUS_TIMELINES_STORE, STATUSES_STORE, ACCOUNTS_STORE]
  await dbPromise(db, storeNames, 'readwrite', (stores) => {
    let [ timelineStore, statusesStore, accountsStore ] = stores
    for (let status of statuses) {
      storeStatus(statusesStore, accountsStore, status)
      timelineStore.put({
        id: createTimelineId(timeline, status.id),
        statusId: status.id
      })
    }
  })
}

export async function insertTimelineItems (instanceName, timeline, timelineItems) {
  return timeline === 'notifications'
    ? insertTimelineNotifications(instanceName, timeline, timelineItems)
    : insertTimelineStatuses(instanceName, timeline, timelineItems)
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
