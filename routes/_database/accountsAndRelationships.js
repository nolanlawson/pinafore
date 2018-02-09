import { ACCOUNTS_STORE, RELATIONSHIPS_STORE } from './constants'
import { accountsCache, relationshipsCache } from './cache'
import { getGenericEntityWithId, setGenericEntityWithId } from './helpers'

export async function getAccount(instanceName, accountId) {
  return await getGenericEntityWithId(ACCOUNTS_STORE, accountsCache, instanceName, accountId)
}

export async function setAccount(instanceName, account) {
  return await setGenericEntityWithId(ACCOUNTS_STORE, accountsCache, instanceName, account)
}

export async function getRelationship(instanceName, accountId) {
  return await getGenericEntityWithId(RELATIONSHIPS_STORE, relationshipsCache, instanceName, accountId)
}

export async function setRelationship(instanceName, relationship) {
  return await setGenericEntityWithId(RELATIONSHIPS_STORE, relationshipsCache, instanceName, relationship)
}