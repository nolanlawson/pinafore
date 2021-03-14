import { dbPromise, getDatabase } from './databaseLifecycle'
import { META_STORE } from './constants'
import { metaCache, hasInCache, getInCache, setInCache } from './cache'

async function getMetaProperty (instanceName, key) {
  if (hasInCache(metaCache, instanceName, key)) {
    return getInCache(metaCache, instanceName, key)
  }
  const db = await getDatabase(instanceName)
  const result = await dbPromise(db, META_STORE, 'readonly', (store, callback) => {
    store.get(key).onsuccess = (e) => {
      callback(e.target.result)
    }
  })
  setInCache(metaCache, instanceName, key, result)
  return result
}

async function setMetaProperty (instanceName, key, value) {
  setInCache(metaCache, instanceName, key, value)
  const db = await getDatabase(instanceName)
  return dbPromise(db, META_STORE, 'readwrite', (store) => {
    store.put(value, key)
  })
}

export async function getInstanceVerifyCredentials (instanceName) {
  return getMetaProperty(instanceName, 'verifyCredentials')
}

export async function setInstanceVerifyCredentials (instanceName, value) {
  return setMetaProperty(instanceName, 'verifyCredentials', value)
}

export async function getInstanceInfo (instanceName) {
  return getMetaProperty(instanceName, 'instance')
}

export async function setInstanceInfo (instanceName, value) {
  return setMetaProperty(instanceName, 'instance', value)
}

export async function getLists (instanceName) {
  return getMetaProperty(instanceName, 'lists')
}

export async function setLists (instanceName, value) {
  return setMetaProperty(instanceName, 'lists', value)
}

export async function getCustomEmoji (instanceName) {
  return getMetaProperty(instanceName, 'customEmoji')
}

export async function setCustomEmoji (instanceName, value) {
  return setMetaProperty(instanceName, 'customEmoji', value)
}

export async function getFollowRequestCount (instanceName) {
  return getMetaProperty(instanceName, 'followRequestCount')
}

export async function setFollowRequestCount (instanceName, value) {
  return setMetaProperty(instanceName, 'followRequestCount', value)
}

export async function getFilters (instanceName) {
  return getMetaProperty(instanceName, 'filters')
}

export async function setFilters (instanceName, value) {
  return setMetaProperty(instanceName, 'filters', value)
}
