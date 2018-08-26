import { cloneForStorage, getGenericEntityWithId, setGenericEntityWithId } from './helpers'
import { RELATIONSHIPS_STORE } from './constants'
import { relationshipsCache } from './cache'

export async function getRelationship (instanceName, accountId) {
  return getGenericEntityWithId(RELATIONSHIPS_STORE, relationshipsCache, instanceName, accountId)
}

export async function setRelationship (instanceName, relationship) {
  return setGenericEntityWithId(RELATIONSHIPS_STORE, relationshipsCache, instanceName, cloneForStorage(relationship))
}
