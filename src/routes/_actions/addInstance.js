import { getAccessTokenFromAuthCode, registerApplication, generateAuthLink } from '../_api/oauth'
import { getInstanceInfo } from '../_api/instance'
import { goto } from '../../../__sapper__/client'
import { switchToTheme } from '../_utils/themeEngine'
import { store } from '../_store/store'
import { updateVerifyCredentialsForInstance } from './instances'
import { updateCustomEmojiForInstance } from './emoji'
import { database } from '../_database/database'

const REDIRECT_URI = (typeof location !== 'undefined'
  ? location.origin : 'https://pinafore.social') + '/settings/instances/add'

async function redirectToOauth () {
  let { instanceNameInSearch, loggedInInstances } = store.get()
  instanceNameInSearch = instanceNameInSearch.replace(/^https?:\/\//, '').replace(/\/$/, '').replace('/$', '').toLowerCase()
  if (Object.keys(loggedInInstances).includes(instanceNameInSearch)) {
    let err = new Error(`You've already logged in to ${instanceNameInSearch}`)
    err.knownError = true
    throw err
  }
  let registrationPromise = registerApplication(instanceNameInSearch, REDIRECT_URI)
  let instanceInfo = await getInstanceInfo(instanceNameInSearch)
  await database.setInstanceInfo(instanceNameInSearch, instanceInfo) // cache for later
  let instanceData = await registrationPromise
  store.set({
    currentRegisteredInstanceName: instanceNameInSearch,
    currentRegisteredInstance: instanceData
  })
  store.save()
  let oauthUrl = generateAuthLink(
    instanceNameInSearch,
    instanceData.client_id,
    REDIRECT_URI
  )
  document.location.href = oauthUrl
}

export async function logInToInstance () {
  store.set({
    logInToInstanceLoading: true,
    logInToInstanceError: null
  })
  try {
    await redirectToOauth()
  } catch (err) {
    console.error(err)
    let error = `${err.message || err.name}. ` +
      (err.knownError ? '' : (navigator.onLine
        ? `Is this a valid Mastodon instance? Is a browser extension
           blocking the request? Are you in private browsing mode?`
        : `Are you offline?`))
    let { instanceNameInSearch } = store.get()
    store.set({
      logInToInstanceError: error,
      logInToInstanceErrorForText: instanceNameInSearch
    })
  } finally {
    store.set({ logInToInstanceLoading: false })
  }
}

export async function registerDefaultInstance () {
  let currentRegisteredInstanceName = 'mastodon.social'
  let { loggedInInstances, instanceThemes } = store.get()
  instanceThemes[currentRegisteredInstanceName] = 'default'
  loggedInInstances[currentRegisteredInstanceName] = {}
  store.set({
    currentInstance: currentRegisteredInstanceName,
    instanceThemes: instanceThemes
  })
  store.save()
  switchToTheme('default')
  return currentRegisteredInstanceName
}

async function registerNewInstance (code) {
  let { currentRegisteredInstanceName, currentRegisteredInstance } = store.get()
  let instanceData = await getAccessTokenFromAuthCode(
    currentRegisteredInstanceName,
    currentRegisteredInstance.client_id,
    currentRegisteredInstance.client_secret,
    code,
    REDIRECT_URI
  )
  let { loggedInInstances, loggedInInstancesInOrder, instanceThemes } = store.get()
  instanceThemes[currentRegisteredInstanceName] = 'default'
  loggedInInstances[currentRegisteredInstanceName] = instanceData
  if (!loggedInInstancesInOrder.includes(currentRegisteredInstanceName)) {
    loggedInInstancesInOrder.push(currentRegisteredInstanceName)
  }
  store.set({
    instanceNameInSearch: '',
    currentRegisteredInstanceName: null,
    currentRegisteredInstance: null,
    loggedInInstances: loggedInInstances,
    currentInstance: currentRegisteredInstanceName,
    loggedInInstancesInOrder: loggedInInstancesInOrder,
    instanceThemes: instanceThemes
  })
  store.save()
  switchToTheme('default')
  // fire off these requests so they're cached
  /* no await */ updateVerifyCredentialsForInstance(currentRegisteredInstanceName)
  /* no await */ updateCustomEmojiForInstance(currentRegisteredInstanceName)
  goto('/')
}

export async function handleOauthCode (code) {
  try {
    store.set({ logInToInstanceLoading: true })
    await registerNewInstance(code)
  } catch (err) {
    store.set({ logInToInstanceError: `${err.message || err.name}. Failed to connect to instance.` })
  } finally {
    store.set({ logInToInstanceLoading: false })
  }
}
