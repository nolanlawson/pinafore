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
  STATUSES_STORE,
  ACCOUNTS_STORE,
  RELATIONSHIPS_STORE
} from './constants'

import {
  statusesCache,
  relationshipsCache,
  accountsCache,
  metaCache,
  clearCache,
  getInCache,
  hasInCache,
  setInCache
} from './cache'

//
// helpers
//

async function getGenericEntityWithId(store, cache, instanceName, id) {
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

async function setGenericEntityWithId(store, cache, instanceName, entity) {
  setInCache(cache, instanceName, entity.id, entity)
  const db = await getDatabase(instanceName)
  return await dbPromise(db, store, 'readwrite', (store) => {
    store.put(entity)
  })
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
  return await getGenericEntityWithId(STATUSES_STORE, statusesCache, instanceName, statusId)
}

//
// meta
//

async function getMetaProperty(instanceName, key) {
  if (hasInCache(metaCache, instanceName, key)) {
    return getInCache(metaCache, instanceName, key)
  }
  const db = await getDatabase(instanceName)
  let result = await dbPromise(db, META_STORE, 'readonly', (store, callback) => {
    store.get(key).onsuccess = (e) => {
      callback(e.target.result && e.target.result.value)
    }
  })
  setInCache(metaCache, instanceName, key, result)
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
// accounts/relationships
//

export async function getAccount(instanceName, accountId) {
  return await getGenericEntityWithId(ACCOUNTS_STORE, accountsCache, instanceName, accountId)
}

export async function setAccount(instanceName, account) {
  return await setGenericEntityWithId(ACCOUNTS_STORE, accountsCache, instanceName, account)
}

export async function getRelationship(instanceName, accountId) {
  return await getGenericEntityWithId(RELATIONSHIPS_STORE, relationshipsCache, instanceName, accountId)
}

export async function setRelationship(instanceName, relationship) {
  return await setGenericEntityWithId(RELATIONSHIPS_STORE, relationshipsCache, instanceName, relationship)
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