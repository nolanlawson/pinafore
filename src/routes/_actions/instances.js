import { getVerifyCredentials } from '../_api/user'
import { store } from '../_store/store'
import { switchToTheme } from '../_utils/themeEngine'
import { toast } from '../_utils/toast'
import { goto } from '../../../__sapper__/client'
import { cacheFirstUpdateAfter } from '../_utils/sync'
import { getInstanceInfo } from '../_api/instance'
import { database } from '../_database/database'

export function changeTheme (instanceName, newTheme) {
  let { instanceThemes } = store.get()
  instanceThemes[instanceName] = newTheme
  store.set({ instanceThemes: instanceThemes })
  store.save()
  let { currentInstance } = store.get()
  if (instanceName === currentInstance) {
    switchToTheme(newTheme)
  }
}

export function switchToInstance (instanceName) {
  let { instanceThemes } = store.get()
  store.set({
    currentInstance: instanceName,
    searchResults: null,
    queryInSearch: ''
  })
  store.save()
  switchToTheme(instanceThemes[instanceName])
}

export async function logOutOfInstance (instanceName) {
  let {
    loggedInInstances,
    instanceThemes,
    loggedInInstancesInOrder,
    composeData,
    currentInstance
  } = store.get()
  loggedInInstancesInOrder.splice(loggedInInstancesInOrder.indexOf(instanceName), 1)
  let newInstance = instanceName === currentInstance
    ? loggedInInstancesInOrder[0]
    : currentInstance
  delete loggedInInstances[instanceName]
  delete instanceThemes[instanceName]
  delete composeData[instanceName]
  store.set({
    loggedInInstances: loggedInInstances,
    instanceThemes: instanceThemes,
    loggedInInstancesInOrder: loggedInInstancesInOrder,
    currentInstance: newInstance,
    searchResults: null,
    queryInSearch: '',
    composeData: composeData
  })
  store.save()
  toast.say(`Logged out of ${instanceName}`)
  switchToTheme(instanceThemes[newInstance] || 'default')
  /* no await */ database.clearDatabaseForInstance(instanceName)
  goto('/settings/instances')
}

function setStoreVerifyCredentials (instanceName, thisVerifyCredentials) {
  let { verifyCredentials } = store.get()
  verifyCredentials[instanceName] = thisVerifyCredentials
  store.set({ verifyCredentials: verifyCredentials })
}

export async function updateVerifyCredentialsForInstance (instanceName) {
  let { loggedInInstances } = store.get()
  let accessToken = loggedInInstances[instanceName].access_token
  await cacheFirstUpdateAfter(
    () => getVerifyCredentials(instanceName, accessToken),
    () => database.getInstanceVerifyCredentials(instanceName),
    verifyCredentials => database.setInstanceVerifyCredentials(instanceName, verifyCredentials),
    verifyCredentials => setStoreVerifyCredentials(instanceName, verifyCredentials)
  )
}

export async function updateVerifyCredentialsForCurrentInstance () {
  let { currentInstance } = store.get()
  await updateVerifyCredentialsForInstance(currentInstance)
}

export async function updateInstanceInfo (instanceName) {
  await cacheFirstUpdateAfter(
    () => getInstanceInfo(instanceName),
    () => database.getInstanceInfo(instanceName),
    info => database.setInstanceInfo(instanceName, info),
    info => {
      let { instanceInfos } = store.get()
      instanceInfos[instanceName] = info
      store.set({ instanceInfos: instanceInfos })
    }
  )
}
