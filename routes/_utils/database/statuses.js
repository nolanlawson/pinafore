import cloneDeep from 'lodash/cloneDeep'

const STORE = 'statuses'

const dbPromise = new Promise((resolve, reject) => {
  let req = indexedDB.open(STORE, 1)
  req.onerror = reject
  req.onblocked = () => {
    console.log('idb blocked')
  }
  req.onupgradeneeded = () => {
    let db = req.result;
    let oStore = db.createObjectStore(STORE, {
      keyPath: 'id'
    })
    oStore.createIndex('created_at', 'created_at')
    oStore.createIndex('pinafore_id_as_negative_big_int', 'pinafore_id_as_negative_big_int')
    oStore.createIndex('pinafore_id_as_big_int', 'pinafore_id_as_big_int')
  }
  req.onsuccess = () => resolve(req.result)
})

function transformStatusForStorage(status) {
  status = cloneDeep(status)
  status.pinafore_id_as_big_int = parseInt(status.id, 10)
  status.pinafore_id_as_negative_big_int = -parseInt(status.id, 10)
  status.pinafore_stale = true
  return status
}

export async function getTimelineAfter(max_id = null, limit = 20) {
  const db = await dbPromise
  return await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const store = tx.objectStore(STORE)
    const index = store.index('pinafore_id_as_negative_big_int')
    let sinceAsNegativeBigInt = max_id === null ? null : -parseInt(max_id, 10)
    let query = sinceAsNegativeBigInt === null ? null : IDBKeyRange.lowerBound(sinceAsNegativeBigInt, false)

    let res
    index.getAll(query, limit).onsuccess = (e) => {
      res = e.target.result
    }

    tx.oncomplete = () => resolve(res)
    tx.onerror = reject
  })
}

export async function insertStatuses(statuses) {
  const db = await dbPromise
  return await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    for (let status of statuses) {
      store.put(transformStatusForStorage(status))
    }
    tx.oncomplete = resolve
    tx.onerror = reject
  })
}