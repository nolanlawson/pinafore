import { getAccount } from '../_api/user.js'
import { getRelationship } from '../_api/relationships.js'
import { database } from '../_database/database.js'
import { store } from '../_store/store.js'

async function _updateAccount (accountId, instanceName, accessToken) {
  const localPromise = database.getAccount(instanceName, accountId)
  const remotePromise = getAccount(instanceName, accessToken, accountId).then(account => {
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
  const localPromise = database.getRelationship(instanceName, accountId)
  const remotePromise = getRelationship(instanceName, accessToken, accountId).then(relationship => {
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
  const { currentInstance, accessToken } = store.get()

  await Promise.all([
    _updateAccount(accountId, currentInstance, accessToken),
    _updateRelationship(accountId, currentInstance, accessToken)
  ])
}

export async function updateRelationship (accountId) {
  const { currentInstance, accessToken } = store.get()

  await _updateRelationship(accountId, currentInstance, accessToken)
}
