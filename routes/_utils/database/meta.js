import { addKnownDb } from './knownDbs'

const databaseCache = {}
export const META_STORE = 'meta'

export function getMetaDatabase(instanceName) {
  const key = `${instanceName}_${META_STORE}`
  if (databaseCache[key]) {
    return Promise.resolve(databaseCache[key])
  }

  let dbName = key

  addKnownDb(instanceName, 'meta', dbName)

  databaseCache[key] = new Promise((resolve, reject) => {
    let req = indexedDB.open(dbName, 1)
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
  return databaseCache[key]
}