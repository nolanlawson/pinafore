import { dbPromise, getDatabase } from '../databaseLifecycle.js'
import {
  deleteFromCache, notificationsCache,
  statusesCache
} from '../cache.js'
import {
  NOTIFICATION_TIMELINES_STORE,
  NOTIFICATIONS_STORE, PINNED_STATUSES_STORE,
  STATUS_TIMELINES_STORE,
  STATUSES_STORE,
  THREADS_STORE
} from '../constants.js'
import {
  createThreadKeyRange
} from '../keys.js'
import { deleteAll } from '../utils.js'

export async function deleteStatusesAndNotifications (instanceName, statusIds, notificationIds) {
  for (const statusId of statusIds) {
    deleteFromCache(statusesCache, instanceName, statusId)
  }
  for (const notificationId of notificationIds) {
    deleteFromCache(notificationsCache, instanceName, notificationId)
  }
  const db = await getDatabase(instanceName)
  const storeNames = [
    STATUSES_STORE,
    STATUS_TIMELINES_STORE,
    NOTIFICATIONS_STORE,
    NOTIFICATION_TIMELINES_STORE,
    PINNED_STATUSES_STORE,
    THREADS_STORE
  ]
  await dbPromise(db, storeNames, 'readwrite', (stores) => {
    const [
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
        notificationTimelinesStore.index('notificationId'),
        IDBKeyRange.only(notificationId)
      )
    }

    for (const statusId of statusIds) {
      deleteStatus(statusId)
    }
    for (const notificationId of notificationIds) {
      deleteNotification(notificationId)
    }
  })
}
