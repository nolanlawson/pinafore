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

const statusesCache = new QuickLRU({maxSize: 100})
const accountsCache = new QuickLRU({maxSize: 50})

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
    }
  }
}

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
    statusesCache.set(status.id, status)
    accountsCache.set(status.account.id, status.account)
    if (status.reblog) {
      accountsCache.set(status.reblog.account.id, status.reblog.account)
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

export async function getInstanceVerifyCredentials(instanceName) {
  const db = await getDatabase(instanceName)
  return await dbPromise(db, META_STORE, 'readonly', (store, callback) => {
    store.get('verifyCredentials').onsuccess = (e) => {
      callback(e.target.result && e.target.result.value)
    }
  })
}

export async function setInstanceVerifyCredentials(instanceName, verifyCredentials) {
  const db = await getDatabase(instanceName)
  return await dbPromise(db, META_STORE, 'readwrite', (store) => {
    store.put({
      key: 'verifyCredentials',
      value: verifyCredentials
    })
  })
}

export async function getAccount(instanceName, accountId) {
  if (accountsCache.has(accountId)) {
    if (process.browser && process.env.NODE_ENV !== 'production') {
      window.cacheStats.accounts.hits++
    }
    return accountsCache.get(accountId)
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

export async function clearDatabaseForInstance(instanceName) {
  await deleteDatabase(instanceName)
}

export async function getStatus(instanceName, statusId) {
  if (statusesCache.has(statusId)) {
    if (process.browser && process.env.NODE_ENV !== 'production') {
      window.cacheStats.statuses.hits++
    }
    return statusesCache.get(statusId)
  }
  const db = await getDatabase(instanceName)
  let result = await dbPromise(db, STATUSES_STORE, 'readonly', (store, callback) => {
    store.get(statusId).onsuccess = (e) => {
      callback(e.target.result && e.target.result)
    }
  })
  statusesCache.set(statusId, result)
  if (process.browser && process.env.NODE_ENV !== 'production') {
    window.cacheStats.statuses.misses++
  }
  return result
}