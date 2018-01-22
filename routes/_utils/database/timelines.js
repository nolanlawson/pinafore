import { addKnownDb } from './knownDbs'

const databaseCache = {}
export const TIMELINE_STORE = 'statuses'

export function createTimelineDbName(instanceName, timeline) {
  return `${instanceName}_timeline_${timeline}`
}

export function getTimelineDatabase(instanceName, timeline) {
  const key = `${instanceName}_${timeline}`
  if (databaseCache[key]) {
    return Promise.resolve(databaseCache[key])
  }

  let dbName = createTimelineDbName(instanceName, timeline)

  addKnownDb(instanceName, 'timeline', dbName)

  databaseCache[key] = new Promise((resolve, reject) => {
    let req = indexedDB.open(dbName, 1)
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
  return databaseCache[key]
}