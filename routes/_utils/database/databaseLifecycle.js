const openReqs = {}
const databaseCache = {}

import {
  META_STORE,
  TIMELINE_STORE,
  STATUSES_STORE
} from './constants'

export function getDatabase(instanceName) {
  if (databaseCache[instanceName]) {
    return Promise.resolve(databaseCache[instanceName])
  }

  databaseCache[instanceName] = new Promise((resolve, reject) => {
    let req = indexedDB.open(instanceName, 1)
    openReqs[instanceName] = req
    req.onerror = reject
    req.onblocked = () => {
      console.log('idb blocked')
    }
    req.onupgradeneeded = () => {
      let db = req.result;
      db.createObjectStore(META_STORE, {keyPath: 'key'})
      db.createObjectStore(STATUSES_STORE, {keyPath: 'id'})
      let timelineStore = db.createObjectStore(TIMELINE_STORE, {keyPath: 'id'})
      timelineStore.createIndex('statusId', 'statusId')
    }
    req.onsuccess = () => resolve(req.result)
  })
  return databaseCache[instanceName]
}

export async function dbPromise(db, storeName, readOnlyOrReadWrite, cb) {
  return await new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, readOnlyOrReadWrite)
    let store = typeof storeName === 'string' ?
      tx.objectStore(storeName) :
      storeName.map(name => tx.objectStore(name))
    let res
    cb(store, (result) => {
      res = result
    })

    tx.oncomplete = () => resolve(res)
    tx.onerror = () => reject(tx.error.name + ' ' + tx.error.message)
  })
}

export function deleteDatabase(instanceName) {
  return new Promise((resolve, reject) => {
    // close any open requests
    let openReq = openReqs[instanceName];
    if (openReq && openReq.result) {
      openReq.result.close()
    }
    delete openReqs[instanceName]
    delete databaseCache[instanceName]
    let req = indexedDB.deleteDatabase(instanceName)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error.name + ' ' + req.error.message)
  })
}