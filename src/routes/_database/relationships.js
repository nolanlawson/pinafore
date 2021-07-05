import { cloneForStorage, getGenericEntityWithId, setGenericEntityWithId } from './helpers.js'
import { RELATIONSHIPS_STORE } from './constants.js'
import { relationshipsCache } from './cache.js'

export async function getRelationship (instanceName, accountId) {
  return getGenericEntityWithId(RELATIONSHIPS_STORE, relationshipsCache, instanceName, accountId)
}

export async function setRelationship (instanceName, relationship) {
  return setGenericEntityWithId(RELATIONSHIPS_STORE, relationshipsCache, instanceName, cloneForStorage(relationship))
}
