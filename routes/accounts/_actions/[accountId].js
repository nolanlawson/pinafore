import { getAccount } from '../../_utils/mastodon/user'
import { database } from '../../_utils/database/database'
import { store } from '../../_utils/store'

export async function showAccountProfile(accountId) {
  store.set({currentAccountProfile: null})
  let instanceName = store.get('currentInstance')
  let accessToken = store.get('accessToken')

  let localPromise = database.getAccount(instanceName, accountId)
  let remotePromise = getAccount(instanceName, accessToken, accountId).then(account => {
    database.setAccount(instanceName, account)
    return account
  })

  let localAccount = await localPromise
  store.set({currentAccountProfile: localAccount})
  try {
    let remoteAccount = await remotePromise
    store.set({currentAccountProfile: remoteAccount})
  } catch (e) {
    console.error("couldn't fetch profile", e)
  }
}