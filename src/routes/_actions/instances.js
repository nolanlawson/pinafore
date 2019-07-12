import { getVerifyCredentials } from '../_api/user'
import { store } from '../_store/store'
import { switchToTheme } from '../_utils/themeEngine'
import { toast } from '../_components/toast/toast'
import { goto } from '../../../__sapper__/client'
import { cacheFirstUpdateAfter } from '../_utils/sync'
import { getInstanceInfo } from '../_api/instance'
import { database } from '../_database/database'

export function changeTheme (instanceName, newTheme) {
  const { instanceThemes } = store.get()
  instanceThemes[instanceName] = newTheme
  store.set({ instanceThemes: instanceThemes })
  store.save()
  const { currentInstance } = store.get()
  if (instanceName === currentInstance) {
    const { enableGrayscale } = store.get()
    switchToTheme(newTheme, enableGrayscale)
  }
}

export function switchToInstance (instanceName) {
  const { instanceThemes } = store.get()
  store.set({
    currentInstance: instanceName,
    searchResults: null,
    queryInSearch: ''
  })
  store.save()
  const { enableGrayscale } = store.get()
  switchToTheme(instanceThemes[instanceName], enableGrayscale)
}

export async function logOutOfInstance (instanceName) {
  const {
    loggedInInstances,
    instanceThemes,
    loggedInInstancesInOrder,
    composeData,
    currentInstance
  } = store.get()
  loggedInInstancesInOrder.splice(loggedInInstancesInOrder.indexOf(instanceName), 1)
  const newInstance = instanceName === currentInstance
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
  const { enableGrayscale } = store.get()
  switchToTheme(instanceThemes[newInstance], enableGrayscale)
  /* no await */ database.clearDatabaseForInstance(instanceName)
  goto('/settings/instances')
}

function setStoreVerifyCredentials (instanceName, thisVerifyCredentials) {
  const { verifyCredentials } = store.get()
  verifyCredentials[instanceName] = thisVerifyCredentials
  store.set({ verifyCredentials: verifyCredentials })
}

export async function updateVerifyCredentialsForInstance (instanceName) {
  const { loggedInInstances } = store.get()
  const accessToken = loggedInInstances[instanceName].access_token
  await cacheFirstUpdateAfter(
    () => getVerifyCredentials(instanceName, accessToken),
    () => database.getInstanceVerifyCredentials(instanceName),
    verifyCredentials => database.setInstanceVerifyCredentials(instanceName, verifyCredentials),
    verifyCredentials => setStoreVerifyCredentials(instanceName, verifyCredentials)
  )
}

export async function updateVerifyCredentialsForCurrentInstance () {
  const { currentInstance } = store.get()
  await updateVerifyCredentialsForInstance(currentInstance)
}

export async function updateInstanceInfo (instanceName) {
  await cacheFirstUpdateAfter(
    () => getInstanceInfo(instanceName),
    () => database.getInstanceInfo(instanceName),
    info => database.setInstanceInfo(instanceName, info),
    info => {
      const { instanceInfos } = store.get()
      instanceInfos[instanceName] = info
      store.set({ instanceInfos: instanceInfos })
    }
  )
}
