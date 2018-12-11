import { dbPromise, getDatabase } from './databaseLifecycle'
import { getInCache, hasInCache, setInCache } from './cache'
import { ACCOUNT_ID, REBLOG_ID, STATUS_ID, TIMESTAMP, USERNAME_LOWERCASE } from './constants'

export async function getGenericEntityWithId (store, cache, instanceName, id) {
  if (hasInCache(cache, instanceName, id)) {
    return getInCache(cache, instanceName, id)
  }
  const db = await getDatabase(instanceName)
  let result = await dbPromise(db, store, 'readonly', (store, callback) => {
    store.get(id).onsuccess = (e) => callback(e.target.result)
  })
  setInCache(cache, instanceName, id, result)
  return result
}

export async function setGenericEntityWithId (store, cache, instanceName, entity) {
  setInCache(cache, instanceName, entity.id, entity)
  const db = await getDatabase(instanceName)
  return dbPromise(db, store, 'readwrite', (store) => {
    store.put(entity)
  })
}

export function cloneForStorage (obj) {
  let res = {}
  let keys = Object.keys(obj)
  for (let key of keys) {
    let value = obj[key]
    // save storage space by skipping nulls, 0s, falses, empty strings, and empty arrays
    if (!value || (Array.isArray(value) && value.length === 0)) {
      continue
    }
    switch (key) {
      case 'account':
        res[ACCOUNT_ID] = value.id
        break
      case 'status':
        res[STATUS_ID] = value.id
        break
      case 'reblog':
        res[REBLOG_ID] = value.id
        break
      case 'acct':
        res[key] = value
        res[USERNAME_LOWERCASE] = value.toLowerCase()
        break
      default:
        res[key] = value
        break
    }
  }
  res[TIMESTAMP] = Date.now()
  return res
}
