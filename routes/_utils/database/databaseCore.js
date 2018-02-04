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
  STATUS_TIMELINES_STORE,
  STATUSES_STORE,
  ACCOUNTS_STORE,
  RELATIONSHIPS_STORE,
  NOTIFICATIONS_STORE, NOTIFICATION_TIMELINES_STORE
} from './constants'

import {
  statusesCache,
  relationshipsCache,
  accountsCache,
  metaCache,
  notificationsCache,
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
// timelines/statuses/notifications
//

function getTimelineVariables(timeline) {
  if (timeline === 'notifications') {
    return {
      stores: [NOTIFICATION_TIMELINES_STORE, NOTIFICATIONS_STORE, ACCOUNTS_STORE],
      remoteId: 'notificationId',
      itemsCache: notificationsCache
    }
  }
  return {
    stores: [STATUS_TIMELINES_STORE, STATUSES_STORE, ACCOUNTS_STORE],
    remoteId: 'statusId',
    itemsCache: statusesCache
  }
}

export async function getTimeline(instanceName, timeline, maxId = null, limit = 20) {
  let { stores, remoteId } = getTimelineVariables(timeline)
  const db = await getDatabase(instanceName)
  return await dbPromise(db, stores, 'readonly', (stores, callback) => {
    let [ timelineStore, itemsStore ] = stores

    let negBigInt = maxId && toReversePaddedBigInt(maxId)
    let start = negBigInt ? (timeline + '\u0000' + negBigInt) : (timeline + '\u0000')
    let end = timeline + '\u0000\uffff'
    let query = IDBKeyRange.bound(start, end, false, false)

    timelineStore.getAll(query, limit).onsuccess = e => {
      let timelineResults = e.target.result
      let res = new Array(timelineResults.length)
      timelineResults.forEach((timelineResult, i) => {
        itemsStore.get(timelineResult[remoteId]).onsuccess = e => {
          res[i] = e.target.result
        }
      })
      callback(res)
    }
  })
}

export async function insertTimelineItems(instanceName, timeline, timelineItems) {
  let { stores, remoteId, itemsCache } = getTimelineVariables(timeline)
  for (let timelineItem of timelineItems) {
    setInCache(itemsCache, instanceName, timelineItem.id, timelineItem)
    setInCache(accountsCache, instanceName, timelineItem.account.id, timelineItem.account)
    if (timelineItem.reblog) {
      setInCache(accountsCache, instanceName, timelineItem.reblog.account.id, timelineItem.reblog.account)
    }
  }
  const db = await getDatabase(instanceName)
  await dbPromise(db, stores, 'readwrite', (stores) => {
    let [ timelineStore, itemsStore, accountsStore ] = stores
    for (let item of timelineItems) {
      itemsStore.put(item)
      // reverse chronological order, prefixed by timeline
      timelineStore.put({
        id: (timeline + '\u0000' + toReversePaddedBigInt(item.id)),
        [remoteId]: item.id
      })
      accountsStore.put(item.account)
      if (item.reblog) {
        accountsStore.put(item.reblog.account)
      }
    }
  })
}

export async function getStatus(instanceName, statusId) {
  return await getGenericEntityWithId(STATUSES_STORE, statusesCache, instanceName, statusId)
}

export async function getNotification(instanceName, notificationId) {
  return await getGenericEntityWithId(NOTIFICATIONS_STORE, notificationsCache, instanceName, notificationId)
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