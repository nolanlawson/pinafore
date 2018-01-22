import { addKnownDb } from './knownDbs'
import { openReqs, databaseCache } from './cache'

export const TIMELINE_STORE = 'statuses'

export function createTimelineDbName(instanceName, timeline) {
  return `${instanceName}_timeline_${timeline}`
}

export function getTimelineDatabase(instanceName, timeline) {
  let dbName = createTimelineDbName(instanceName, timeline)

  if (databaseCache[dbName]) {
    return Promise.resolve(databaseCache[dbName])
  }

  addKnownDb(instanceName, 'timeline', dbName)

  databaseCache[dbName] = new Promise((resolve, reject) => {
    let req = indexedDB.open(dbName, 1)
    openReqs[dbName] = req
    req.onerror = reject
    req.onblocked = () => {
      console.log('idb blocked')
    }
    req.onupgradeneeded = () => {
      let db = req.result;
      let oStore = db.createObjectStore(TIMELINE_STORE, {
        keyPath: 'id'
      })
      oStore.createIndex('pinafore_id_as_negative_big_int', 'pinafore_id_as_negative_big_int')
    }
    req.onsuccess = () => resolve(req.result)
  })
  return databaseCache[dbName]
}