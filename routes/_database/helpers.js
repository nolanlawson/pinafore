import { dbPromise, getDatabase } from './databaseLifecycle'
import { getInCache, hasInCache, setInCache } from './cache'

export async function getGenericEntityWithId(store, cache, instanceName, id) {
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

export async function setGenericEntityWithId(store, cache, instanceName, entity) {
  setInCache(cache, instanceName, entity.id, entity)
  const db = await getDatabase(instanceName)
  return await dbPromise(db, store, 'readwrite', (store) => {
    store.put(entity)
  })
}