import {
  META_STORE,
  STATUS_TIMELINES_STORE,
  STATUSES_STORE,
  ACCOUNTS_STORE,
  RELATIONSHIPS_STORE,
  NOTIFICATIONS_STORE,
  NOTIFICATION_TIMELINES_STORE,
  PINNED_STATUSES_STORE,
  TIMESTAMP,
  REBLOG_ID,
  THREADS_STORE,
  STATUS_ID
} from './constants'

const openReqs = {}
const databaseCache = {}

const DB_VERSION = 6

export function getDatabase (instanceName) {
  if (!instanceName) {
    throw new Error('instanceName is undefined in getDatabase()')
  }
  if (databaseCache[instanceName]) {
    return Promise.resolve(databaseCache[instanceName])
  }

  databaseCache[instanceName] = new Promise((resolve, reject) => {
    let req = indexedDB.open(instanceName, DB_VERSION)
    openReqs[instanceName] = req
    req.onerror = reject
    req.onblocked = () => {
      console.log('idb blocked')
    }
    req.onupgradeneeded = (e) => {
      let db = req.result
      let tx = e.currentTarget.transaction
      if (e.oldVersion < 5) {
        db.createObjectStore(STATUSES_STORE, {keyPath: 'id'})
          .createIndex(TIMESTAMP, TIMESTAMP)
        db.createObjectStore(STATUS_TIMELINES_STORE)
          .createIndex('statusId', '')
        db.createObjectStore(NOTIFICATIONS_STORE, {keyPath: 'id'})
          .createIndex(TIMESTAMP, TIMESTAMP)
        db.createObjectStore(NOTIFICATION_TIMELINES_STORE)
          .createIndex('notificationId', '')
        db.createObjectStore(ACCOUNTS_STORE, {keyPath: 'id'})
          .createIndex(TIMESTAMP, TIMESTAMP)
        db.createObjectStore(RELATIONSHIPS_STORE, {keyPath: 'id'})
          .createIndex(TIMESTAMP, TIMESTAMP)
        db.createObjectStore(META_STORE)
        db.createObjectStore(PINNED_STATUSES_STORE)
        tx.objectStore(STATUSES_STORE).createIndex(REBLOG_ID, REBLOG_ID)
        tx.objectStore(NOTIFICATIONS_STORE).createIndex('statusId', 'statusId')
        db.createObjectStore(THREADS_STORE)
      }
      if (e.oldVersion < 6) {
        tx.objectStore(NOTIFICATIONS_STORE).createIndex(STATUS_ID, STATUS_ID)
      }
    }
    req.onsuccess = () => resolve(req.result)
  })
  return databaseCache[instanceName]
}

export async function dbPromise (db, storeName, readOnlyOrReadWrite, cb) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, readOnlyOrReadWrite)
    let store = typeof storeName === 'string'
      ? tx.objectStore(storeName)
      : storeName.map(name => tx.objectStore(name))
    let res
    cb(store, (result) => {
      res = result
    })

    tx.oncomplete = () => resolve(res)
    tx.onerror = () => reject(tx.error)
  })
}

export function deleteDatabase (instanceName) {
  return new Promise((resolve, reject) => {
    // close any open requests
    let openReq = openReqs[instanceName]
    if (openReq && openReq.result) {
      openReq.result.close()
    }
    delete openReqs[instanceName]
    delete databaseCache[instanceName]
    let req = indexedDB.deleteDatabase(instanceName)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}
