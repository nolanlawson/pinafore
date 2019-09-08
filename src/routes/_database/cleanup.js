import { dbPromise, getDatabase } from './databaseLifecycle'
import {
  ACCOUNTS_STORE,
  NOTIFICATION_TIMELINES_STORE,
  NOTIFICATIONS_STORE,
  PINNED_STATUSES_STORE,
  RELATIONSHIPS_STORE,
  STATUS_TIMELINES_STORE,
  STATUSES_STORE,
  THREADS_STORE,
  TIMESTAMP
} from './constants'
import debounce from 'lodash-es/debounce'
import { mark, stop } from '../_utils/marks'
import { deleteAll } from './utils'
import { createPinnedStatusKeyRange, createThreadKeyRange } from './keys'
import { getKnownInstances } from './knownInstances'
import noop from 'lodash-es/noop'
import { CLEANUP_DELAY, CLEANUP_TIME_AGO } from '../_static/database'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'

const BATCH_SIZE = 20

function batchedGetAll (callGetAll, callback) {
  function nextBatch () {
    callGetAll().onsuccess = function (e) {
      const results = e.target.result
      callback(results)
      if (results.length) {
        nextBatch()
      }
    }
  }
  nextBatch()
}

function cleanupStatuses (statusesStore, statusTimelinesStore, threadsStore, cutoff) {
  batchedGetAll(
    () => statusesStore.index(TIMESTAMP).getAllKeys(IDBKeyRange.upperBound(cutoff), BATCH_SIZE),
    results => {
      results.forEach(statusId => {
        statusesStore.delete(statusId)
        deleteAll(
          statusTimelinesStore,
          statusTimelinesStore.index('statusId'),
          IDBKeyRange.only(statusId)
        )
        deleteAll(
          threadsStore,
          threadsStore,
          createThreadKeyRange(statusId)
        )
      })
    }
  )
}

function cleanupNotifications (notificationsStore, notificationTimelinesStore, cutoff) {
  batchedGetAll(
    () => notificationsStore.index(TIMESTAMP).getAllKeys(IDBKeyRange.upperBound(cutoff), BATCH_SIZE),
    results => {
      results.forEach(notificationId => {
        notificationsStore.delete(notificationId)
        deleteAll(
          notificationTimelinesStore,
          notificationTimelinesStore.index('notificationId'),
          IDBKeyRange.only(notificationId)
        )
      })
    }
  )
}

function cleanupAccounts (accountsStore, pinnedStatusesStore, cutoff) {
  batchedGetAll(
    () => accountsStore.index(TIMESTAMP).getAllKeys(IDBKeyRange.upperBound(cutoff), BATCH_SIZE),
    results => {
      results.forEach(accountId => {
        accountsStore.delete(accountId)
        deleteAll(
          pinnedStatusesStore,
          pinnedStatusesStore,
          createPinnedStatusKeyRange(accountId)
        )
      })
    }
  )
}

function cleanupRelationships (relationshipsStore, cutoff) {
  batchedGetAll(
    () => relationshipsStore.index(TIMESTAMP).getAllKeys(IDBKeyRange.upperBound(cutoff), BATCH_SIZE),
    results => {
      results.forEach(relationshipId => {
        relationshipsStore.delete(relationshipId)
      })
    }
  )
}

export async function cleanup (instanceName) {
  console.log('cleanup', instanceName)
  mark(`cleanup:${instanceName}`)
  const db = await getDatabase(instanceName)
  const storeNames = [
    STATUSES_STORE,
    STATUS_TIMELINES_STORE,
    NOTIFICATIONS_STORE,
    NOTIFICATION_TIMELINES_STORE,
    ACCOUNTS_STORE,
    RELATIONSHIPS_STORE,
    THREADS_STORE,
    PINNED_STATUSES_STORE
  ]
  await dbPromise(db, storeNames, 'readwrite', (stores) => {
    const [
      statusesStore,
      statusTimelinesStore,
      notificationsStore,
      notificationTimelinesStore,
      accountsStore,
      relationshipsStore,
      threadsStore,
      pinnedStatusesStore
    ] = stores

    const cutoff = Date.now() - CLEANUP_TIME_AGO

    cleanupStatuses(statusesStore, statusTimelinesStore, threadsStore, cutoff)
    cleanupNotifications(notificationsStore, notificationTimelinesStore, cutoff)
    cleanupAccounts(accountsStore, pinnedStatusesStore, cutoff)
    cleanupRelationships(relationshipsStore, cutoff)
  })
  stop(`cleanup:${instanceName}`)
}

function doCleanup (instanceName) {
  scheduleIdleTask(() => cleanup(instanceName))
}

async function scheduledCleanup () {
  console.log('scheduledCleanup')
  const knownInstances = await getKnownInstances()
  for (const instance of knownInstances) {
    doCleanup(instance)
  }
}

// we have unit tests that test indexedDB; we don't want this thing to run forever
export const scheduleCleanup = process.browser ? debounce(scheduledCleanup, CLEANUP_DELAY) : noop
