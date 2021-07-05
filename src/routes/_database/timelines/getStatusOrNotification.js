import { dbPromise, getDatabase } from '../databaseLifecycle.js'
import { getInCache, hasInCache, notificationsCache, setInCache, statusesCache } from '../cache.js'
import {
  ACCOUNTS_STORE,
  NOTIFICATIONS_STORE,
  STATUSES_STORE
} from '../constants.js'
import { fetchStatus } from './fetchStatus.js'
import { fetchNotification } from './fetchNotification.js'

export async function getStatus (instanceName, id) {
  if (hasInCache(statusesCache, instanceName, id)) {
    return getInCache(statusesCache, instanceName, id)
  }
  const db = await getDatabase(instanceName)
  const storeNames = [STATUSES_STORE, ACCOUNTS_STORE]
  const result = await dbPromise(db, storeNames, 'readonly', (stores, callback) => {
    const [statusesStore, accountsStore] = stores
    fetchStatus(statusesStore, accountsStore, id, callback)
  })
  setInCache(statusesCache, instanceName, id, result)
  return result
}

export async function getNotification (instanceName, id) {
  if (hasInCache(notificationsCache, instanceName, id)) {
    return getInCache(notificationsCache, instanceName, id)
  }
  const db = await getDatabase(instanceName)
  const storeNames = [NOTIFICATIONS_STORE, STATUSES_STORE, ACCOUNTS_STORE]
  const result = await dbPromise(db, storeNames, 'readonly', (stores, callback) => {
    const [notificationsStore, statusesStore, accountsStore] = stores
    fetchNotification(notificationsStore, statusesStore, accountsStore, id, callback)
  })
  setInCache(notificationsCache, instanceName, id, result)
  return result
}
