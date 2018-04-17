import { getAccount, getRelationship } from '../_api/user'
import {
  getAccount as getAccountFromDatabase,
  setAccount as setAccountInDatabase,
  getRelationship as getRelationshipFromDatabase,
  setRelationship as setRelationshipInDatabase
} from '../_database/accountsAndRelationships'
import { store } from '../_store/store'

async function updateAccount (accountId, instanceName, accessToken) {
  let localPromise = getAccountFromDatabase(instanceName, accountId)
  let remotePromise = getAccount(instanceName, accessToken, accountId).then(account => {
    /* no await */ setAccountInDatabase(instanceName, account)
    return account
  })

  try {
    store.set({currentAccountProfile: (await localPromise)})
  } catch (e) {
    console.error(e)
  }
  try {
    store.set({currentAccountProfile: (await remotePromise)})
  } catch (e) {
    console.error(e)
  }
}

async function updateRelationship (accountId, instanceName, accessToken) {
  let localPromise = getRelationshipFromDatabase(instanceName, accountId)
  let remotePromise = getRelationship(instanceName, accessToken, accountId).then(relationship => {
    /* no await */ setRelationshipInDatabase(instanceName, relationship)
    return relationship
  })
  try {
    store.set({currentAccountRelationship: (await localPromise)})
  } catch (e) {
    console.error(e)
  }
  try {
    store.set({currentAccountRelationship: (await remotePromise)})
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
  let instanceName = store.get('currentInstance')
  let accessToken = store.get('accessToken')

  await Promise.all([
    updateAccount(accountId, instanceName, accessToken),
    updateRelationship(accountId, instanceName, accessToken)
  ])
}
