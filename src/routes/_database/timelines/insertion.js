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
  for (const notification of notifications) {
    setInCache(notificationsCache, instanceName, notification.id, notification)
    setInCache(accountsCache, instanceName, notification.account.id, notification.account)
    if (notification.status) {
      setInCache(statusesCache, instanceName, notification.status.id, notification.status)
    }
  }
  const db = await getDatabase(instanceName)
  const storeNames = [NOTIFICATION_TIMELINES_STORE, NOTIFICATIONS_STORE, ACCOUNTS_STORE, STATUSES_STORE]
  await dbPromise(db, storeNames, 'readwrite', (stores) => {
    const [timelineStore, notificationsStore, accountsStore, statusesStore] = stores
    for (const notification of notifications) {
      storeNotification(notificationsStore, statusesStore, accountsStore, notification)
      timelineStore.put(notification.id, createTimelineId(timeline, notification.id))
    }
  })
}

async function insertTimelineStatuses (instanceName, timeline, statuses) {
  for (const status of statuses) {
    cacheStatus(status, instanceName)
  }
  const db = await getDatabase(instanceName)
  const storeNames = [STATUS_TIMELINES_STORE, STATUSES_STORE, ACCOUNTS_STORE]
  await dbPromise(db, storeNames, 'readwrite', (stores) => {
    const [timelineStore, statusesStore, accountsStore] = stores
    for (const status of statuses) {
      storeStatus(statusesStore, accountsStore, status)
      timelineStore.put(status.id, createTimelineId(timeline, status.id))
    }
  })
}

async function insertStatusThread (instanceName, statusId, statuses) {
  for (const status of statuses) {
    cacheStatus(status, instanceName)
  }
  const db = await getDatabase(instanceName)
  const storeNames = [THREADS_STORE, STATUSES_STORE, ACCOUNTS_STORE]
  await dbPromise(db, storeNames, 'readwrite', (stores) => {
    const [threadsStore, statusesStore, accountsStore] = stores
    threadsStore.getAllKeys(createThreadKeyRange(statusId)).onsuccess = e => {
      const existingKeys = e.target.result
      const newKeys = times(statuses.length, i => createThreadId(statusId, i))
      const keysToDelete = difference(existingKeys, newKeys)
      for (const key of keysToDelete) {
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
  console.log('insertTimelineItems', instanceName, timeline, timelineItems)
  /* no await */ scheduleCleanup()
  if (timeline === 'notifications' || timeline === 'notifications/mentions') {
    return insertTimelineNotifications(instanceName, timeline, timelineItems)
  } else if (timeline.startsWith('status/')) {
    const statusId = timeline.split('/').slice(-1)[0]
    return insertStatusThread(instanceName, statusId, timelineItems)
  } else {
    return insertTimelineStatuses(instanceName, timeline, timelineItems)
  }
}

export async function insertStatus (instanceName, status) {
  cacheStatus(status, instanceName)
  const db = await getDatabase(instanceName)
  await dbPromise(db, [STATUSES_STORE, ACCOUNTS_STORE], 'readwrite', ([statusesStore, accountsStore]) => {
    storeStatus(statusesStore, accountsStore, status)
  })
}
