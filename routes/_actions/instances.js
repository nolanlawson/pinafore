import { getVerifyCredentials } from '../_api/user'
import { store } from '../_store/store'
import { switchToTheme } from '../_utils/themeEngine'
import { toast } from '../_utils/toast'
import { database } from '../_database/database'
import { goto } from 'sapper/runtime.js'
import { cacheFirstUpdateAfter } from '../_utils/sync'
import { getInstanceInfo } from '../_api/instance'

export function changeTheme (instanceName, newTheme) {
  let instanceThemes = store.get('instanceThemes')
  instanceThemes[instanceName] = newTheme
  store.set({instanceThemes: instanceThemes})
  store.save()
  if (instanceName === store.get('currentInstance')) {
    switchToTheme(newTheme)
  }
}

export function switchToInstance (instanceName) {
  let instanceThemes = store.get('instanceThemes')
  store.set({currentInstance: instanceName})
  store.save()
  switchToTheme(instanceThemes[instanceName])
}

export async function logOutOfInstance (instanceName) {
  let loggedInInstances = store.get('loggedInInstances')
  let instanceThemes = store.get('instanceThemes')
  let loggedInInstancesInOrder = store.get('loggedInInstancesInOrder')
  let currentInstance = store.get('currentInstance')
  loggedInInstancesInOrder.splice(loggedInInstancesInOrder.indexOf(instanceName), 1)
  let newInstance = instanceName === currentInstance
    ? loggedInInstancesInOrder[0]
    : currentInstance
  delete loggedInInstances[instanceName]
  delete instanceThemes[instanceName]
  store.set({
    loggedInInstances: loggedInInstances,
    instanceThemes: instanceThemes,
    loggedInInstancesInOrder: loggedInInstancesInOrder,
    currentInstance: newInstance,
    searchResults: null,
    queryInSearch: ''
  })
  store.save()
  toast.say(`Logged out of ${instanceName}`)
  switchToTheme(instanceThemes[newInstance] || 'default')
  await database.clearDatabaseForInstance(instanceName)
  goto('/settings/instances')
}

function setStoreVerifyCredentials (instanceName, thisVerifyCredentials) {
  let verifyCredentials = store.get('verifyCredentials') || {}
  verifyCredentials[instanceName] = thisVerifyCredentials
  store.set({verifyCredentials: verifyCredentials})
}

export async function updateVerifyCredentialsForInstance (instanceName) {
  let loggedInInstances = store.get('loggedInInstances')
  let accessToken = loggedInInstances[instanceName].access_token
  await cacheFirstUpdateAfter(
    () => getVerifyCredentials(instanceName, accessToken),
    () => database.getInstanceVerifyCredentials(instanceName),
    verifyCredentials => database.setInstanceVerifyCredentials(instanceName, verifyCredentials),
    verifyCredentials => setStoreVerifyCredentials(instanceName, verifyCredentials)
  )
}

export async function updateInstanceInfo (instanceName) {
  await cacheFirstUpdateAfter(
    () => getInstanceInfo(instanceName),
    () => database.getInstanceInfo(instanceName),
    info => database.setInstanceInfo(instanceName, info),
    info => {
      let instanceInfos = store.get('instanceInfos')
      instanceInfos[instanceName] = info
      store.set({instanceInfos: instanceInfos})
    }
  )
}
