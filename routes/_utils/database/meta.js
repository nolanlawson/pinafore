import { addKnownDb } from './knownDbs'
import { openReqs, databaseCache } from './cache'

export const META_STORE = 'meta'

export function getMetaDatabase(instanceName) {
  const dbName = `${instanceName}_${META_STORE}`
  if (databaseCache[dbName]) {
    return Promise.resolve(databaseCache[dbName])
  }

  addKnownDb(instanceName, 'meta', dbName)

  databaseCache[dbName] = new Promise((resolve, reject) => {
    let req = indexedDB.open(dbName, 1)
    openReqs[dbName] = req
    req.onerror = reject
    req.onblocked = () => {
      console.log('idb blocked')
    }
    req.onupgradeneeded = () => {
      let db = req.result;
      db.createObjectStore(META_STORE, {keyPath: 'key'})
    }
    req.onsuccess = () => resolve(req.result)
  })
  return databaseCache[dbName]
}