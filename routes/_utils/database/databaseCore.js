import {
  toReversePaddedBigInt
} from './utils'
import {
  getDatabase,
  dbPromise,
  deleteDatabase,
} from './databaseLifecycle'

import {
  META_STORE,
  TIMELINE_STORE,
  STATUSES_STORE, ACCOUNTS_STORE
} from './constants'

import QuickLRU from 'quick-lru'

const statusesCache = {
  maxSize: 100,
  caches: {}
}
const accountsCache = {
  maxSize: 50,
  caches: {}
}
const metaCache = {
  maxSize: 20,
  caches: {}
}

if (process.browser && process.env.NODE_ENV !== 'production') {
  window.cacheStats = {
    statuses: {
      cache: statusesCache,
      hits: 0,
      misses: 0
    },
    accounts: {
      cache: accountsCache,
      hits: 0,
      misses: 0
    },
    meta: {
      cache: accountsCache,
      hits: 0,
      misses: 0
    }
  }
}

function clearCache(cache, instanceName) {
  delete cache.caches[instanceName]
}

function getOrCreateInstanceCache(cache, instanceName) {
  let cached = cache.caches[instanceName]
  if (!cached) {
    cached = cache.caches[instanceName] = new QuickLRU({maxSize: cache.maxSize})
  }
  return cached
}

function setInCache(cache, instanceName, key, value) {
  let instanceCache = getOrCreateInstanceCache(cache, instanceName)
  return instanceCache.set(key, value)
}

function getInCache(cache, instanceName, key) {
  let instanceCache = getOrCreateInstanceCache(cache, instanceName)
  return instanceCache.get(key)
}

function hasInCache(cache, instanceName, key) {
  let instanceCache = getOrCreateInstanceCache(cache, instanceName)
  return instanceCache.has(key)
}

//
// timelines/statuses
//

export async function getTimeline(instanceName, timeline, maxId = null, limit = 20) {
  const db = await getDatabase(instanceName, timeline)
  return await dbPromise(db, [TIMELINE_STORE, STATUSES_STORE], 'readonly', (stores, callback) => {
    let [ timelineStore, statusesStore ] = stores

    let negBigInt = maxId && toReversePaddedBigInt(maxId)
    let start = negBigInt ? (timeline + '\u0000' + negBigInt) : (timeline + '\u0000')
    let end = timeline + '\u0000\uffff'
    let query = IDBKeyRange.bound(start, end, false, false)

    timelineStore.getAll(query, limit).onsuccess = e => {
      let timelineResults = e.target.result
      let res = new Array(timelineResults.length)
      timelineResults.forEach((timelineResult, i) => {
        statusesStore.get(timelineResult.statusId).onsuccess = e => {
          res[i] = e.target.result
        }
      })
      callback(res)
    }
  })
}

export async function insertStatuses(instanceName, timeline, statuses) {
  for (let status of statuses) {
    setInCache(statusesCache, instanceName, status.id, status)
    setInCache(accountsCache, instanceName, status.account.id, status.account)
    if (status.reblog) {
      setInCache(accountsCache, instanceName, status.reblog.account.id, status.reblog.account)
    }
  }
  const db = await getDatabase(instanceName, timeline)
  await dbPromise(db, [TIMELINE_STORE, STATUSES_STORE, ACCOUNTS_STORE], 'readwrite', (stores) => {
    let [ timelineStore, statusesStore, accountsStore ] = stores
    for (let status of statuses) {
      statusesStore.put(status)
      // reverse chronological order, prefixed by timeline
      timelineStore.put({
        id: (timeline + '\u0000' +  toReversePaddedBigInt(status.id)),
        statusId: status.id
      })
      accountsStore.put(status.account)
      if (status.reblog) {
        accountsStore.put(status.reblog.account)
      }
    }
  })
}

export async function getStatus(instanceName, statusId) {
  if (hasInCache(statusesCache, instanceName, statusId)) {
    if (process.browser && process.env.NODE_ENV !== 'production') {
      window.cacheStats.statuses.hits++
    }
    return getInCache(statusesCache, instanceName, statusId)
  }
  const db = await getDatabase(instanceName)
  let result = await dbPromise(db, STATUSES_STORE, 'readonly', (store, callback) => {
    store.get(statusId).onsuccess = (e) => {
      callback(e.target.result && e.target.result)
    }
  })
  setInCache(statusesCache, instanceName, statusId, result)
  if (process.browser && process.env.NODE_ENV !== 'production') {
    window.cacheStats.statuses.misses++
  }
  return result
}

//
// meta
//

async function getMetaProperty(instanceName, key) {
  if (hasInCache(metaCache, instanceName, key)) {
    if (process.browser && process.env.NODE_ENV !== 'production') {
      window.cacheStats.meta.hits++
    }
    return getInCache(metaCache, instanceName, key)
  }
  const db = await getDatabase(instanceName)
  let result = await dbPromise(db, META_STORE, 'readonly', (store, callback) => {
    store.get(key).onsuccess = (e) => {
      callback(e.target.result && e.target.result.value)
    }
  })
  setInCache(metaCache, instanceName, key, result)
  if (process.browser && process.env.NODE_ENV !== 'production') {
    window.cacheStats.meta.misses++
  }
  return result
}

async function setMetaProperty(instanceName, key, value) {
  setInCache(metaCache, instanceName, key, value)
  const db = await getDatabase(instanceName)
  return await dbPromise(db, META_STORE, 'readwrite', (store) => {
    store.put({
      key: key,
      value: value
    })
  })
}

export async function getInstanceVerifyCredentials(instanceName) {
  return await getMetaProperty(instanceName, 'verifyCredentials')
}

export async function setInstanceVerifyCredentials(instanceName, value) {
  return await setMetaProperty(instanceName, 'verifyCredentials', value)
}

export async function getInstanceInfo(instanceName) {
  return await getMetaProperty(instanceName, 'instance')
}

export async function setInstanceInfo(instanceName, value) {
  return await setMetaProperty(instanceName, 'instance', value)
}

//
// accounts
//

export async function getAccount(instanceName, accountId) {
  if (hasInCache(accountsCache, instanceName, accountId)) {
    if (process.browser && process.env.NODE_ENV !== 'production') {
      window.cacheStats.accounts.hits++
    }
    return getInCache(accountsCache, instanceName, accountId)
  }
  const db = await getDatabase(instanceName)
  let result = await dbPromise(db, ACCOUNTS_STORE, 'readonly', (store, callback) => {
    store.get(accountId).onsuccess = (e) => {
      callback(e.target.result && e.target.result)
    }
  })
  if (process.browser && process.env.NODE_ENV !== 'production') {
    window.cacheStats.accounts.misses++
  }
  return result
}

export async function setAccount(instanceName, account) {
  setInCache(accountsCache, instanceName, account.id, account)
  const db = await getDatabase(instanceName)
  return await dbPromise(db, ACCOUNTS_STORE, 'readwrite', (store) => {
    store.put(account)
  })
}

//
// lifecycle
//

export async function clearDatabaseForInstance(instanceName) {
  clearCache(statusesCache, instanceName)
  clearCache(accountsCache, instanceName)
  clearCache(metaCache, instanceName)
  await deleteDatabase(instanceName)
}