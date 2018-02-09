import { ACCOUNTS_STORE, RELATIONSHIPS_STORE } from './constants'
import { accountsCache, relationshipsCache } from './cache'
import { getGenericEntityWithId, setGenericEntityWithId } from './helpers'

export async function getAccount (instanceName, accountId) {
  return getGenericEntityWithId(ACCOUNTS_STORE, accountsCache, instanceName, accountId)
}

export async function setAccount (instanceName, account) {
  return setGenericEntityWithId(ACCOUNTS_STORE, accountsCache, instanceName, account)
}

export async function getRelationship (instanceName, accountId) {
  return getGenericEntityWithId(RELATIONSHIPS_STORE, relationshipsCache, instanceName, accountId)
}

export async function setRelationship (instanceName, relationship) {
  return setGenericEntityWithId(RELATIONSHIPS_STORE, relationshipsCache, instanceName, relationship)
}
