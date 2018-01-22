import { META_STORE, getMetaDatabase } from './meta'
import { cleanupOldStatuses } from './cleanupTimelines'
import { TIMELINE_STORE, getTimelineDatabase } from './timelines'
import { toReversePaddedBigInt, transformStatusForStorage, dbPromise, deleteDbPromise } from './utils'
import { getKnownDbsForInstance, deleteInstanceFromKnownDbs } from './knownDbs'

export async function getTimeline(instanceName, timeline, maxId = null, limit = 20) {
  const db = await getTimelineDatabase(instanceName, timeline)
  return await dbPromise(db, TIMELINE_STORE, 'readonly', (store, callback) => {
    const index = store.index('pinafore_id_as_negative_big_int')
    let sinceAsNegativeBigInt = maxId ? toReversePaddedBigInt(maxId) : null
    let query = sinceAsNegativeBigInt ? IDBKeyRange.lowerBound(sinceAsNegativeBigInt, false) : null

    index.getAll(query, limit).onsuccess = (e) => {
      callback(e.target.result)
    }
  })
}

export async function insertStatuses(instanceName, timeline, statuses) {
  const db = await getTimelineDatabase(instanceName, timeline)
  await dbPromise(db, TIMELINE_STORE, 'readwrite', (store) => {
    for (let status of statuses) {
      store.put(transformStatusForStorage(status))
    }
  })
  /* no await */ cleanupOldStatuses()
}

export async function getInstanceVerifyCredentials(instanceName) {
  const db = await getMetaDatabase(instanceName)
  return await dbPromise(db, META_STORE, 'readonly', (store, callback) => {
    store.get('verifyCredentials').onsuccess = (e) => {
      callback(e.target.result && e.target.result.value)
    }
  })
}

export async function setInstanceVerifyCredentials(instanceName, verifyCredentials) {
  const db = await getMetaDatabase(instanceName)
  return await dbPromise(db, META_STORE, 'readwrite', (store) => {
    store.put({
      key: 'verifyCredentials',
      value: verifyCredentials
    })
  })
}

export async function clearDatabasesForInstance(instanceName) {
  console.log('clearDatabasesForInstance', instanceName)
  const knownDbsForInstance = await getKnownDbsForInstance(instanceName)
  for (let knownDb of knownDbsForInstance) {
    let { dbName } = knownDb
    try {
      await deleteDbPromise(dbName)
      console.error(`deleted database ${dbName}`)
    } catch (e) {
      console.error(`failed to delete database ${dbName}`)
    }
  }
  await deleteInstanceFromKnownDbs(instanceName)
}