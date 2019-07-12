import { dbPromise, getDatabase } from '../databaseLifecycle'
import {
  ACCOUNTS_STORE,
  NOTIFICATION_TIMELINES_STORE,
  NOTIFICATIONS_STORE,
  STATUS_TIMELINES_STORE,
  STATUSES_STORE,
  THREADS_STORE
} from '../constants'
import {
  createThreadKeyRange,
  createTimelineKeyRange
} from '../keys'
import { fetchStatus } from './fetchStatus'
import { fetchNotification } from './fetchNotification'
import { TIMELINE_BATCH_SIZE } from '../../_static/timelines'

async function getNotificationTimeline (instanceName, timeline, maxId, limit) {
  const storeNames = [NOTIFICATION_TIMELINES_STORE, NOTIFICATIONS_STORE, STATUSES_STORE, ACCOUNTS_STORE]
  const db = await getDatabase(instanceName)
  return dbPromise(db, storeNames, 'readonly', (stores, callback) => {
    const [timelineStore, notificationsStore, statusesStore, accountsStore] = stores
    const keyRange = createTimelineKeyRange(timeline, maxId)

    timelineStore.getAll(keyRange, limit).onsuccess = e => {
      const timelineResults = e.target.result
      const res = new Array(timelineResults.length)
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
  const storeNames = [STATUS_TIMELINES_STORE, STATUSES_STORE, ACCOUNTS_STORE]
  const db = await getDatabase(instanceName)
  return dbPromise(db, storeNames, 'readonly', (stores, callback) => {
    const [timelineStore, statusesStore, accountsStore] = stores
    const getReq = timelineStore.getAll(createTimelineKeyRange(timeline, maxId), limit)
    getReq.onsuccess = e => {
      const timelineResults = e.target.result
      const res = new Array(timelineResults.length)
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
  const storeNames = [THREADS_STORE, STATUSES_STORE, ACCOUNTS_STORE]
  const db = await getDatabase(instanceName)
  return dbPromise(db, storeNames, 'readonly', (stores, callback) => {
    const [threadsStore, statusesStore, accountsStore] = stores
    const keyRange = createThreadKeyRange(statusId)
    threadsStore.getAll(keyRange).onsuccess = e => {
      const thread = e.target.result
      if (thread.length) {
        const res = new Array(thread.length)
        callback(res)
        thread.forEach((otherStatusId, i) => {
          fetchStatus(statusesStore, accountsStore, otherStatusId, status => {
            res[i] = status
          })
        })
      } else {
        // thread not cached; just make a "fake" thread with only one status in it
        fetchStatus(statusesStore, accountsStore, statusId, status => {
          const res = [status]
          callback(res)
        })
      }
    }
  })
}

export async function getTimeline (instanceName, timeline, maxId, limit) {
  maxId = maxId || null
  limit = limit || TIMELINE_BATCH_SIZE
  if (timeline === 'notifications' || timeline === 'notifications/mentions') {
    return getNotificationTimeline(instanceName, timeline, maxId, limit)
  } else if (timeline.startsWith('status/')) {
    const statusId = timeline.split('/').slice(-1)[0]
    return getStatusThread(instanceName, statusId)
  } else {
    return getStatusTimeline(instanceName, timeline, maxId, limit)
  }
}
