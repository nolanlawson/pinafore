import { registerDefaultInstance } from './addInstance'
import { getAccount } from '../_api/user'
import { getRelationship } from '../_api/relationships'
import { database } from '../_database/database'
import { store } from '../_store/store'

async function _updateAccount (accountId, instanceName, accessToken) {
  let localPromise = database.getAccount(instanceName, accountId)
  let remotePromise = getAccount(instanceName, accessToken, accountId).then(account => {
    /* no await */ database.setAccount(instanceName, account)
    return account
  })

  try {
    store.set({ currentAccountProfile: (await localPromise) })
  } catch (e) {
    console.error(e)
  }
  try {
    store.set({ currentAccountProfile: (await remotePromise) })
  } catch (e) {
    console.error(e)
  }
}

async function _updateRelationship (accountId, instanceName, accessToken) {
  let localPromise = database.getRelationship(instanceName, accountId)
  let remotePromise = getRelationship(instanceName, accessToken, accountId).then(relationship => {
    /* no await */ database.setRelationship(instanceName, relationship)
    return relationship
  })
  try {
    store.set({ currentAccountRelationship: (await localPromise) })
  } catch (e) {
    console.error(e)
  }
  try {
    store.set({ currentAccountRelationship: (await remotePromise) })
  } catch (e) {
    console.error(e)
  }
}

export async function updateLocalRelationship (instanceName, accountId, relationship) {
  await database.setRelationship(instanceName, relationship)
  try {
    store.set({ currentAccountRelationship: relationship })
  } catch (e) {
    console.error(e)
  }
}

export async function clearProfileAndRelationship () {
  store.set({
    currentAccountProfile: null,
    currentAccountRelationship: null
  })
}

export async function updateProfileAndRelationship (accountId) {
  let { currentInstance, accessToken } = store.get()
  if (currentInstance === undefined || currentInstance === null) {
    currentInstance = await registerDefaultInstance()
  }

  await Promise.all([
    _updateAccount(accountId, currentInstance, accessToken),
    _updateRelationship(accountId, currentInstance, accessToken)
  ])
}

export async function updateRelationship (accountId) {
  let { currentInstance, accessToken } = store.get()
  if (currentInstance === undefined || currentInstance === null) {
    currentInstance = await registerDefaultInstance()
  }

  await _updateRelationship(accountId, currentInstance, accessToken)
}
