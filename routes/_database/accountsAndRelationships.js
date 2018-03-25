import {
  ACCOUNTS_STORE, RELATIONSHIPS_STORE, USERNAME_LOWERCASE
} from './constants'
import { accountsCache, relationshipsCache } from './cache'
import { cloneForStorage, getGenericEntityWithId, setGenericEntityWithId } from './helpers'
import { dbPromise, getDatabase } from './databaseLifecycle'
import { createAccountUsernamePrefixKeyRange } from './keys'

export async function getAccount (instanceName, accountId) {
  return getGenericEntityWithId(ACCOUNTS_STORE, accountsCache, instanceName, accountId)
}

export async function setAccount (instanceName, account) {
  return setGenericEntityWithId(ACCOUNTS_STORE, accountsCache, instanceName, cloneForStorage(account))
}

export async function getRelationship (instanceName, accountId) {
  return getGenericEntityWithId(RELATIONSHIPS_STORE, relationshipsCache, instanceName, accountId)
}

export async function setRelationship (instanceName, relationship) {
  return setGenericEntityWithId(RELATIONSHIPS_STORE, relationshipsCache, instanceName, cloneForStorage(relationship))
}

export async function searchAccountsByUsername (instanceName, usernamePrefix, limit = 20) {
  const db = await getDatabase(instanceName)
  return dbPromise(db, ACCOUNTS_STORE, 'readonly', (accountsStore, callback) => {
    let keyRange = createAccountUsernamePrefixKeyRange(usernamePrefix.toLowerCase())
    accountsStore.index(USERNAME_LOWERCASE).getAll(keyRange, limit).onsuccess = e => {
      let results = e.target.result
      results = results.sort((a, b) => {
        // accounts you're following go first
        if (a.following !== b.following) {
          return a.following ? -1 : 1
        }
        // after that, just sort by username
        if (a[USERNAME_LOWERCASE] !== b[USERNAME_LOWERCASE]) {
          return a[USERNAME_LOWERCASE] < b[USERNAME_LOWERCASE] ? -1 : 1
        }
        return 0 // eslint-disable-line
      })
      callback(results)
    }
  })
}
