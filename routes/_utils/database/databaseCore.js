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
  STATUSES_STORE
} from './constants'

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
  const db = await getDatabase(instanceName, timeline)
  await dbPromise(db, [TIMELINE_STORE, STATUSES_STORE], 'readwrite', (stores) => {
    let [ timelineStore, statusesStore ] = stores
    for (let status of statuses) {
      statusesStore.put(status)
      // reverse chronological order, prefixed by timeline
      let id = timeline + '\u0000' +  toReversePaddedBigInt(status.id)
      timelineStore.put({
        id: id,
        statusId: status.id
      })
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

export async function clearDatabaseForInstance(instanceName) {
  await deleteDatabase(instanceName)
}