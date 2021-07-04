import { ACCOUNTS_STORE, USERNAME_LOWERCASE } from './constants.js'
import { accountsCache } from './cache.js'
import { cloneForStorage, getGenericEntityWithId, setGenericEntityWithId } from './helpers.js'
import { dbPromise, getDatabase } from './databaseLifecycle.js'
import { createAccountUsernamePrefixKeyRange } from './keys.js'

export async function getAccount (instanceName, accountId) {
  return getGenericEntityWithId(ACCOUNTS_STORE, accountsCache, instanceName, accountId)
}

export async function setAccount (instanceName, account) {
  return setGenericEntityWithId(ACCOUNTS_STORE, accountsCache, instanceName, cloneForStorage(account))
}

export async function searchAccountsByUsername (instanceName, usernamePrefix, limit) {
  limit = limit || 20
  const db = await getDatabase(instanceName)
  return dbPromise(db, ACCOUNTS_STORE, 'readonly', (accountsStore, callback) => {
    const keyRange = createAccountUsernamePrefixKeyRange(usernamePrefix.toLowerCase())
    accountsStore.index(USERNAME_LOWERCASE).getAll(keyRange, limit).onsuccess = e => {
      callback(e.target.result)
    }
  })
}
