import { dbPromise, getDatabase } from './databaseLifecycle'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'
import {
  ACCOUNTS_STORE,
  NOTIFICATION_TIMELINES_STORE,
  NOTIFICATIONS_STORE,
  RELATIONSHIPS_STORE,
  STATUS_TIMELINES_STORE,
  STATUSES_STORE,
  TIMESTAMP
} from './constants'
import debounce from 'lodash/debounce'
import { store } from '../_store/store'
import { mark, stop } from '../_utils/marks'

const BATCH_SIZE = 20
const TIME_AGO = 14 * 24 * 60 * 60 * 1000 // two weeks ago
const DELAY = 5 * 60 * 1000               // five minutes

function batchedGetAll (callGetAll, callback) {
  function nextBatch () {
    callGetAll().onsuccess = function (e) {
      let results = e.target.result
      callback(results)
      if (results.length) {
        nextBatch()
      }
    }
  }
  nextBatch()
}

function cleanupStatuses (statusesStore, statusTimelinesStore, cutoff) {
  batchedGetAll(
    () => statusesStore.index(TIMESTAMP).getAll(IDBKeyRange.upperBound(cutoff), BATCH_SIZE),
    results => {
      results.forEach(result => {
        statusesStore.delete(result.id)
        let req = statusTimelinesStore.index('statusId').getAll(IDBKeyRange.only(result.id))
        req.onsuccess = e => {
          let results = e.target.result
          results.forEach(result => {
            statusTimelinesStore.delete(result.id)
          })
        }
      })
    }
  )
}

function cleanupNotifications (notificationsStore, notificationTimelinesStore, cutoff) {
  batchedGetAll(
    () => notificationsStore.index(TIMESTAMP).getAll(IDBKeyRange.upperBound(cutoff), BATCH_SIZE),
    results => {
      results.forEach(result => {
        notificationsStore.delete(result.id)
        let req = notificationTimelinesStore.index('notificationId').getAll(IDBKeyRange.only(result.id))
        req.onsuccess = e => {
          let results = e.target.result
          results.forEach(result => {
            notificationTimelinesStore.delete(result.id)
          })
        }
      })
    }
  )
}

function cleanupAccounts (accountsStore, cutoff) {
  batchedGetAll(
    () => accountsStore.index(TIMESTAMP).getAll(IDBKeyRange.upperBound(cutoff), BATCH_SIZE),
    (results) => {
      results.forEach(result => {
        accountsStore.delete(result.id)
      })
    }
  )
}

function cleanupRelationships (relationshipsStore, cutoff) {
  batchedGetAll(
    () => relationshipsStore.index(TIMESTAMP).getAll(IDBKeyRange.upperBound(cutoff), BATCH_SIZE),
    (results) => {
      results.forEach(result => {
        relationshipsStore.delete(result.id)
      })
    }
  )
}

async function cleanup (instanceName) {
  console.log('cleanup', instanceName)
  mark(`cleanup:${instanceName}`)
  let db = await getDatabase(instanceName)
  let storeNames = [
    STATUSES_STORE,
    STATUS_TIMELINES_STORE,
    NOTIFICATIONS_STORE,
    NOTIFICATION_TIMELINES_STORE,
    ACCOUNTS_STORE,
    RELATIONSHIPS_STORE
  ]
  await dbPromise(db, storeNames, 'readwrite', (stores) => {
    let [
      statusesStore,
      statusTimelinesStore,
      notificationsStore,
      notificationTimelinesStore,
      accountsStore,
      relationshipsStore
    ] = stores

    let cutoff = Date.now() - TIME_AGO

    cleanupStatuses(statusesStore, statusTimelinesStore, cutoff)
    cleanupNotifications(notificationsStore, notificationTimelinesStore, cutoff)
    cleanupAccounts(accountsStore, cutoff)
    cleanupRelationships(relationshipsStore, cutoff)
  })
  stop(`cleanup:${instanceName}`)
}

function doCleanup (instanceName) {
  scheduleIdleTask(() => cleanup(instanceName))
}

function scheduledCleanup () {
  console.log('scheduledCleanup')
  let instances = store.get('loggedInInstancesInOrder')
  for (let instance of instances) {
    doCleanup(instance)
  }
}

export const scheduleCleanup = debounce(() => scheduleIdleTask(scheduledCleanup), DELAY)
