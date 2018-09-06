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
      if (thread.length) {
        let res = new Array(thread.length)
        callback(res)
        thread.forEach((otherStatusId, i) => {
          fetchStatus(statusesStore, accountsStore, otherStatusId, status => {
            res[i] = status
          })
        })
      } else {
        // thread not cached; just make a "fake" thread with only one status in it
        fetchStatus(statusesStore, accountsStore, statusId, status => {
          let res = [status]
          callback(res)
        })
      }
    }
  })
}

export async function getTimeline (instanceName, timeline, maxId, limit) {
  maxId = maxId || null
  limit = limit || TIMELINE_BATCH_SIZE
  if (timeline === 'notifications') {
    return getNotificationTimeline(instanceName, timeline, maxId, limit)
  } else if (timeline.startsWith('status/')) {
    let statusId = timeline.split('/').slice(-1)[0]
    return getStatusThread(instanceName, statusId)
  } else {
    return getStatusTimeline(instanceName, timeline, maxId, limit)
  }
}
