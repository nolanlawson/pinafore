import { getAccessTokenFromAuthCode, registerApplication, generateAuthLink } from '../_api/oauth'
import { getInstanceInfo } from '../_api/instance'
import { goto } from '../../../__sapper__/client'
import { DEFAULT_THEME, switchToTheme } from '../_utils/themeEngine'
import { store } from '../_store/store'
import { updateVerifyCredentialsForInstance } from './instances'
import { updateCustomEmojiForInstance } from './emoji'
import { database } from '../_database/database'
import { DOMAIN_BLOCKS } from '../_static/blocks'

function createKnownError (message) {
  const err = new Error(message)
  err.knownError = true
  return err
}

function getRedirectUri () {
  const { copyPasteMode } = store.get()
  return copyPasteMode ? 'urn:ietf:wg:oauth:2.0:oob' : `${location.origin}/settings/instances/add`
}

async function redirectToOauth () {
  let { instanceNameInSearch, loggedInInstances } = store.get()
  instanceNameInSearch = instanceNameInSearch.replace(/^https?:\/\//, '').replace(/\/+$/, '').toLowerCase()
  if (Object.keys(loggedInInstances).includes(instanceNameInSearch)) {
    throw createKnownError(`You've already logged in to ${instanceNameInSearch}`)
  }
  const instanceHostname = new URL(`http://${instanceNameInSearch}`).hostname
  if (DOMAIN_BLOCKS.some(domain => new RegExp(`(?:\\.|^)${domain}$`, 'i').test(instanceHostname))) {
    throw createKnownError('This service is blocked')
  }
  const redirectUri = getRedirectUri()
  const registrationPromise = registerApplication(instanceNameInSearch, redirectUri)
  const instanceInfo = await getInstanceInfo(instanceNameInSearch)
  await database.setInstanceInfo(instanceNameInSearch, instanceInfo) // cache for later
  const instanceData = await registrationPromise
  store.set({
    currentRegisteredInstanceName: instanceNameInSearch,
    currentRegisteredInstance: instanceData
  })
  store.save()
  const oauthUrl = generateAuthLink(
    instanceNameInSearch,
    instanceData.client_id,
    redirectUri
  )
  // setTimeout to allow the browser to *actually* save the localStorage data (fixes Safari bug apparently)
  const { copyPasteMode } = store.get()
  setTimeout(() => {
    if (copyPasteMode) {
      window.open(oauthUrl, '_blank', 'noopener')
    } else {
      document.location.href = oauthUrl
    }
  }, 200)
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
    const error = `${err.message || err.name}. ` +
      (err.knownError ? '' : (navigator.onLine
        ? `Is this a valid Mastodon instance? Is a browser extension
           blocking the request? Are you in private browsing mode?`
        : 'Are you offline?'))
    const { instanceNameInSearch } = store.get()
    store.set({
      logInToInstanceError: error,
      logInToInstanceErrorForText: instanceNameInSearch
    })
  } finally {
    store.set({ logInToInstanceLoading: false })
  }
}

async function registerNewInstance (code) {
  const { currentRegisteredInstanceName, currentRegisteredInstance } = store.get()
  const redirectUri = getRedirectUri()
  const instanceData = await getAccessTokenFromAuthCode(
    currentRegisteredInstanceName,
    currentRegisteredInstance.client_id,
    currentRegisteredInstance.client_secret,
    code,
    redirectUri
  )
  const { loggedInInstances, loggedInInstancesInOrder, instanceThemes } = store.get()
  instanceThemes[currentRegisteredInstanceName] = DEFAULT_THEME
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
    instanceThemes: instanceThemes,
    copyPasteMode: false
  })
  store.save()
  const { enableGrayscale } = store.get()
  switchToTheme(DEFAULT_THEME, enableGrayscale)
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

export async function handleCopyPasteOauthCode (code) {
  const { currentRegisteredInstanceName, currentRegisteredInstance } = store.get()
  if (!currentRegisteredInstanceName || !currentRegisteredInstance) {
    store.set({
      logInToInstanceError: 'You must log in to an instance first.',
      logInToInstanceErrorForText: '',
      instanceNameInSearch: ''
    })
  } else {
    await handleOauthCode(code)
  }
}
