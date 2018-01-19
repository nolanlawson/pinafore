import cloneDeep from 'lodash/cloneDeep'
import padStart from 'lodash/padStart'

const STORE = 'statuses'

function toPaddedBigInt(id) {
  return padStart(id, 30, '0')
}

function toReversePaddedBigInt(id) {
  let bigInt = toPaddedBigInt(id)
  let res = ''
  for (let i = 0; i < bigInt.length; i++) {
    res += (9 - parseInt(bigInt.charAt(i), 10)).toString(10)
  }
  return res
}

function transformStatusForStorage(status) {
  status = cloneDeep(status)
  status.pinafore_id_as_big_int = toPaddedBigInt(status.id)
  status.pinafore_id_as_negative_big_int = toReversePaddedBigInt(status.id)
  status.pinafore_stale = true
  return status
}

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

export async function getTimelineAfter(max_id = null, limit = 20) {
  const db = await dbPromise
  return await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const store = tx.objectStore(STORE)
    const index = store.index('pinafore_id_as_negative_big_int')
    let sinceAsNegativeBigInt = max_id === null ? null : toReversePaddedBigInt(max_id)
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