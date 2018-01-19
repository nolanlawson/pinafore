import keyval from "idb-keyval"

const databaseCache = {}
export const OBJECT_STORE = 'statuses'

export function createDbName(instanceName, timeline) {
  return `${OBJECT_STORE}_${instanceName}_${timeline}`
}

export function getDatabase(instanceName, timeline) {
  const key = `${instanceName}_${timeline}`
  if (databaseCache[key]) {
    return Promise.resolve(databaseCache[key])
  }

  let dbName = createDbName(instanceName, timeline)

  keyval.get('known_dbs').then(knownDbs => {
    knownDbs = knownDbs || {}
    knownDbs[dbName] = [instanceName, timeline]
    keyval.set('known_dbs', knownDbs)
  })

  databaseCache[key] = new Promise((resolve, reject) => {
    let req = indexedDB.open(dbName, 1)
    req.onerror = reject
    req.onblocked = () => {
      console.log('idb blocked')
    }
    req.onupgradeneeded = () => {
      let db = req.result;
      let oStore = db.createObjectStore(OBJECT_STORE, {
        keyPath: 'id'
      })
      oStore.createIndex('pinafore_id_as_negative_big_int', 'pinafore_id_as_negative_big_int')
    }
    req.onsuccess = () => resolve(req.result)
  })
  return databaseCache[key]
}