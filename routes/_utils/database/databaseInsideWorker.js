import { META_STORE, getMetaDatabase } from './meta'
import { cleanupOldStatuses } from './cleanupTimelines'
import { TIMELINE_STORE, getTimelineDatabase } from './timelines'
import { toReversePaddedBigInt, transformStatusForStorage } from './utils'

export async function getTimeline(instanceName, timeline, maxId = null, limit = 20) {
  const db = await getTimelineDatabase(instanceName, timeline)
  return await new Promise((resolve, reject) => {
    const tx = db.transaction(TIMELINE_STORE, 'readonly')
    const store = tx.objectStore(TIMELINE_STORE)
    const index = store.index('pinafore_id_as_negative_big_int')
    let sinceAsNegativeBigInt = maxId ? toReversePaddedBigInt(maxId) : null
    let query = sinceAsNegativeBigInt ? IDBKeyRange.lowerBound(sinceAsNegativeBigInt, false) : null

    let res
    index.getAll(query, limit).onsuccess = (e) => {
      res = e.target.result
    }

    tx.oncomplete = () => resolve(res)
    tx.onerror = () => reject(tx.error.name + ' ' + tx.error.message)
  })
}

export async function insertStatuses(instanceName, timeline, statuses) {
  const db = await getTimelineDatabase(instanceName, timeline)
  await new Promise((resolve, reject) => {
    const tx = db.transaction(TIMELINE_STORE, 'readwrite')
    const store = tx.objectStore(TIMELINE_STORE)
    for (let status of statuses) {
      store.put(transformStatusForStorage(status))
    }
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error.name + ' ' + tx.error.message)
  })
  /* no await */ cleanupOldStatuses()
}

export async function setInstanceVerifyCredentials(instanceName, verifyCredentials) {
  const db = await getMetaDatabase(instanceName)
  return await new Promise((resolve, reject) => {
    const tx = db.transaction(META_STORE, 'readwrite')
    const store = tx.objectStore(META_STORE)
    store.put({
      key: 'verifyCredentials',
      value: verifyCredentials
    })
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error.name + ' ' + tx.error.message)
  })
}

export async function getInstanceVerifyCredentials(instanceName, verifyCredentials) {
  const db = await getMetaDatabase(instanceName)
  return await new Promise((resolve, reject) => {
    const tx = db.transaction(META_STORE, 'readwrite')
    const store = tx.objectStore(META_STORE)
    let res
    store.get('verifyCredentials').onsuccess = (e) => {
      res = e.target.result && e.target.result.value
    }
    tx.oncomplete = () => resolve(res)
    tx.onerror = () => reject(tx.error.name + ' ' + tx.error.message)
  })
}