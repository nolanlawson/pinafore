import difference from 'lodash-es/difference'
import times from 'lodash-es/times'
import { cloneForStorage } from '../helpers'
import { dbPromise, getDatabase } from '../databaseLifecycle'
import { accountsCache, notificationsCache, setInCache, statusesCache } from '../cache'
import { scheduleCleanup } from '../cleanup'
import {
  ACCOUNTS_STORE,
  NOTIFICATION_TIMELINES_STORE,
  NOTIFICATIONS_STORE,
  STATUS_TIMELINES_STORE,
  STATUSES_STORE,
  THREADS_STORE
} from '../constants'
import {
  createThreadId,
  createThreadKeyRange,
  createTimelineId
} from '../keys'
import { cacheStatus } from './cacheStatus'

export function putStatus (statusesStore, status) {
  statusesStore.put(cloneForStorage(status))
}

export function putAccount (accountsStore, account) {
  accountsStore.put(cloneForStorage(account))
}

export function putNotification (notificationsStore, notification) {
  notificationsStore.put(cloneForStorage(notification))
}

export function storeAccount (accountsStore, account) {
  putAccount(accountsStore, account)
}

export function storeStatus (statusesStore, accountsStore, status) {
  putStatus(statusesStore, status)
  putAccount(accountsStore, status.account)
  if (status.reblog) {
    putStatus(statusesStore, status.reblog)
    putAccount(accountsStore, status.reblog.account)
  }
}

export function storeNotification (notificationsStore, statusesStore, accountsStore, notification) {
  if (notification.status) {
    storeStatus(statusesStore, accountsStore, notification.status)
  }
  storeAccount(accountsStore, notification.account)
  putNotification(notificationsStore, notification)
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
