import { getVerifyCredentials } from '../../../_api/user'
import { store } from '../../../_store/store'
import { switchToTheme } from '../../../_utils/themeEngine'
import { toast } from '../../../_utils/toast'
import { database } from '../../../_database/database'
import { goto } from 'sapper/runtime.js'
import pAny from 'p-any'

export function changeTheme(instanceName, newTheme) {
  let instanceThemes = store.get('instanceThemes')
  instanceThemes[instanceName] = newTheme
  store.set({instanceThemes: instanceThemes})
  store.save()
  if (instanceName === store.get('currentInstance')) {
    switchToTheme(newTheme)
  }
}

export function switchToInstance(instanceName) {
  let instanceThemes = store.get('instanceThemes')
  store.set({currentInstance: instanceName})
  store.save()
  switchToTheme(instanceThemes[instanceName])
}

export async function logOutOfInstance(instanceName) {
  let loggedInInstances = store.get('loggedInInstances')
  let instanceThemes = store.get('instanceThemes')
  let loggedInInstancesInOrder = store.get('loggedInInstancesInOrder')
  let currentInstance = store.get('currentInstance')
  loggedInInstancesInOrder.splice(loggedInInstancesInOrder.indexOf(instanceName), 1)
  let newInstance = instanceName === currentInstance ?
    loggedInInstancesInOrder[0] :
    currentInstance
  delete loggedInInstances[instanceName]
  delete instanceThemes[instanceName]
  store.set({
    loggedInInstances: loggedInInstances,
    instanceThemes: instanceThemes,
    loggedInInstancesInOrder: loggedInInstancesInOrder,
    currentInstance: newInstance
  })
  store.save()
  toast.say(`Logged out of ${instanceName}`)
  switchToTheme(instanceThemes[newInstance] || 'default')
  await database.clearDatabaseForInstance(instanceName)
  goto('/settings/instances')
}

function setStoreVerifyCredentials(instanceName, thisVerifyCredentials) {
  let verifyCredentials = store.get('verifyCredentials') || {}
  verifyCredentials[instanceName] = thisVerifyCredentials
  store.set({verifyCredentials: verifyCredentials})
}

export async function updateVerifyCredentialsForInstance(instanceName) {
  let loggedInInstances = store.get('loggedInInstances')
  let instanceData = loggedInInstances[instanceName]
  await pAny([
    database.getInstanceVerifyCredentials(instanceName).then(verifyCredentials => {
      setStoreVerifyCredentials(instanceName, verifyCredentials)
    }),
    getVerifyCredentials(instanceName, instanceData.access_token).then(verifyCredentials => {
      setStoreVerifyCredentials(instanceName, verifyCredentials)
      return database.setInstanceVerifyCredentials(instanceName, verifyCredentials)
    })
  ])
}