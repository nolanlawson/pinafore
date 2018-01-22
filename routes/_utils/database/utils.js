import cloneDeep from 'lodash/cloneDeep'
import padStart from 'lodash/padStart'
import { databaseCache, openReqs } from './cache'

export function toPaddedBigInt (id) {
  return padStart(id, 30, '0')
}

export function toReversePaddedBigInt (id) {
  let bigInt = toPaddedBigInt(id)
  let res = ''
  for (let i = 0; i < bigInt.length; i++) {
    res += (9 - parseInt(bigInt.charAt(i), 10)).toString(10)
  }
  return res
}

export function transformStatusForStorage (status) {
  status = cloneDeep(status)
  status.pinafore_id_as_negative_big_int = toReversePaddedBigInt(status.id)
  status.pinafore_stale = true
  return status
}

export async function dbPromise(db, storeName, readOnlyOrReadWrite, cb) {
  return await new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, readOnlyOrReadWrite)
    const store = tx.objectStore(storeName)
    let res
    cb(store, (result) => {
      res = result
    })

    tx.oncomplete = () => resolve(res)
    tx.onerror = () => reject(tx.error.name + ' ' + tx.error.message)
  })
}

export function deleteDbPromise(dbName) {
  return new Promise((resolve, reject) => {
    // close any open requests
    let openReq = openReqs[dbName];
    if (openReq && openReq.result) {
      openReq.result.close()
    }
    delete openReqs[dbName]
    delete databaseCache[dbName]
    let req = indexedDB.deleteDatabase(dbName)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error.name + ' ' + req.error.message)
  })
}