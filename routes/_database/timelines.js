import { toReversePaddedBigInt } from './utils'
import { dbPromise, getDatabase } from './databaseLifecycle'
import { accountsCache, notificationsCache, setInCache, statusesCache } from './cache'
import {
  ACCOUNTS_STORE, NOTIFICATION_TIMELINES_STORE, NOTIFICATIONS_STORE, STATUS_TIMELINES_STORE,
  STATUSES_STORE
} from './constants'
import { getGenericEntityWithId } from './helpers'

function createKeyRange(timeline, maxId) {
  let negBigInt = maxId && toReversePaddedBigInt(maxId)
  let start = negBigInt ? (timeline + '\u0000' + negBigInt) : (timeline + '\u0000')
  let end = timeline + '\u0000\uffff'
  return IDBKeyRange.bound(start, end, false, false)
}

async function getNotificationTimeline(instanceName, timeline, maxId, limit) {
  let storeNames = [NOTIFICATION_TIMELINES_STORE, NOTIFICATIONS_STORE]
  const db = await getDatabase(instanceName)
  return await dbPromise(db, storeNames, 'readonly', (stores, callback) => {
    let [ timelineStore, notificationsStore ] = stores
    let keyRange = createKeyRange(timeline, maxId)

    timelineStore.getAll(keyRange, limit).onsuccess = e => {
      let timelineResults = e.target.result
      let res = new Array(timelineResults.length)
      timelineResults.forEach((timelineResult, i) => {
        notificationsStore.get(timelineResult.notificationId).onsuccess = e => {
          res[i] = e.target.result
        }
      })
      callback(res)
    }
  })
}

async function getStatusTimeline(instanceName, timeline, maxId, limit) {
  let storeNames = [STATUS_TIMELINES_STORE, STATUSES_STORE]
  const db = await getDatabase(instanceName)
  return await dbPromise(db, storeNames, 'readonly', (stores, callback) => {
    let [ timelineStore, statusesStore ] = stores
    let keyRange = createKeyRange(timeline, maxId)

    timelineStore.getAll(keyRange, limit).onsuccess = e => {
      let timelineResults = e.target.result
      let res = new Array(timelineResults.length)
      timelineResults.forEach((timelineResult, i) => {
        statusesStore.get(timelineResult.statusId).onsuccess = e => {
          res[i] = e.target.result
        }
      })
      callback(res)
    }
  })
}

export async function getTimeline(instanceName, timeline, maxId = null, limit = 20) {
  return timeline === 'notifications' ?
    await getNotificationTimeline(instanceName, timeline, maxId, limit) :
    await getStatusTimeline(instanceName, timeline, maxId, limit)
}

function createTimelineId(timeline, id) {
  // reverse chronological order, prefixed by timeline
  return timeline + '\u0000' + toReversePaddedBigInt(id)
}

async function insertTimelineNotifications(instanceName, timeline, notifications) {
  let storeNames = [NOTIFICATION_TIMELINES_STORE, NOTIFICATIONS_STORE, ACCOUNTS_STORE]
  for (let notification of notifications) {
    setInCache(notificationsCache, instanceName, notification.id, notification)
    setInCache(accountsCache, instanceName, notification.account.id, notification.account)
  }
  const db = await getDatabase(instanceName)
  await dbPromise(db, storeNames, 'readwrite', (stores) => {
    let [ timelineStore, notificationsStore, accountsStore ] = stores
    for (let notification of notifications) {
      notificationsStore.put(notification)
      timelineStore.put({
        id: createTimelineId(timeline, notification.id),
        notificationId: notification.id
      })
      accountsStore.put(notification.account)
    }
  })
}

async function insertTimelineStatuses(instanceName, timeline, statuses) {
  let storeNames = [STATUS_TIMELINES_STORE, STATUSES_STORE, ACCOUNTS_STORE]
  for (let status of statuses) {
    setInCache(statusesCache, instanceName, status.id, status)
    setInCache(accountsCache, instanceName, status.account.id, status.account)
    if (status.reblog) {
      setInCache(accountsCache, instanceName, status.reblog.account.id, status.reblog.account)
    }
  }
  const db = await getDatabase(instanceName)
  await dbPromise(db, storeNames, 'readwrite', (stores) => {
    let [ timelineStore, statusesStore, accountsStore ] = stores
    for (let status of statuses) {
      statusesStore.put(status)
      timelineStore.put({
        id: createTimelineId(timeline, status.id),
        statusId: status.id
      })
      accountsStore.put(status.account)
      if (status.reblog) {
        accountsStore.put(status.reblog.account)
      }
    }
  })
}

export async function insertTimelineItems(instanceName, timeline, timelineItems) {
  return timeline === 'notifications' ?
    await insertTimelineNotifications(instanceName, timeline, timelineItems) :
    await insertTimelineStatuses(instanceName, timeline, timelineItems)
}

export async function getStatus(instanceName, statusId) {
  return await getGenericEntityWithId(STATUSES_STORE, statusesCache, instanceName, statusId)
}

export async function getNotification(instanceName, notificationId) {
  return await getGenericEntityWithId(NOTIFICATIONS_STORE, notificationsCache, instanceName, notificationId)
}