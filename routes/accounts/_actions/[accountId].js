import { getAccount, getRelationship } from '../../_utils/mastodon/user'
import { database } from '../../_utils/database/database'
import { store } from '../../_utils/store'

async function updateAccount(accountId, instanceName, accessToken) {
  let localPromise = database.getAccount(instanceName, accountId)
  let remotePromise = getAccount(instanceName, accessToken, accountId).then(account => {
    database.setAccount(instanceName, account)
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

async function updateRelationship(accountId, instanceName, accessToken) {
  let localPromise = database.getRelationship(instanceName, accountId)
  let remotePromise = getRelationship(instanceName, accessToken, accountId).then(relationship => {
    database.setRelationship(instanceName, relationship)
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

export async function updateProfileAndRelationship(accountId) {
  store.set({
    currentAccountProfile: null,
    currentAccountRelationship: null
  })
  let instanceName = store.get('currentInstance')
  let accessToken = store.get('accessToken')

  await Promise.all([
    updateAccount(accountId, instanceName, accessToken),
    updateRelationship(accountId, instanceName, accessToken)
  ])
}