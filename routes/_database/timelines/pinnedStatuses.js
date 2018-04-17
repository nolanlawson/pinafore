import { cacheStatus } from './cacheStatus'
import { getDatabase, dbPromise } from '../databaseLifecycle'
import { PINNED_STATUSES_STORE, STATUSES_STORE, ACCOUNTS_STORE } from '../constants'
import { createPinnedStatusId, createPinnedStatusKeyRange } from '../keys'
import { storeStatus } from './insertion'
import { fetchStatus } from './fetchStatus'

export async function insertPinnedStatuses (instanceName, accountId, statuses) {
  for (let status of statuses) {
    cacheStatus(status, instanceName)
  }
  const db = await getDatabase(instanceName)
  let storeNames = [PINNED_STATUSES_STORE, STATUSES_STORE, ACCOUNTS_STORE]
  await dbPromise(db, storeNames, 'readwrite', (stores) => {
    let [ pinnedStatusesStore, statusesStore, accountsStore ] = stores
    statuses.forEach((status, i) => {
      storeStatus(statusesStore, accountsStore, status)
      pinnedStatusesStore.put(status.id, createPinnedStatusId(accountId, i))
    })
  })
}

export async function getPinnedStatuses (instanceName, accountId) {
  let storeNames = [PINNED_STATUSES_STORE, STATUSES_STORE, ACCOUNTS_STORE]
  const db = await getDatabase(instanceName)
  return dbPromise(db, storeNames, 'readonly', (stores, callback) => {
    let [ pinnedStatusesStore, statusesStore, accountsStore ] = stores
    let keyRange = createPinnedStatusKeyRange(accountId)
    pinnedStatusesStore.getAll(keyRange).onsuccess = e => {
      let pinnedResults = e.target.result
      let res = new Array(pinnedResults.length)
      pinnedResults.forEach((statusId, i) => {
        fetchStatus(statusesStore, accountsStore, statusId, status => {
          res[i] = status
        })
      })
      callback(res)
    }
  })
}
