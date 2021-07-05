// "Secret" API to quickly log in with an access token and instance name.
// Used in the integration tests. Can't see a problem with exposing this publicly
// since you would have to know the access token anyway.

import { store } from '../_store/store.js'
import { goto } from '../../../__sapper__/client.js'

export function doQuickLoginIfNecessary () {
  const params = new URLSearchParams(location.search)
  const accessToken = params.get('accessToken')
  const instanceName = params.get('instanceName')
  if (!accessToken || !instanceName) {
    return
  }
  const {
    loggedInInstances,
    loggedInInstancesInOrder
  } = store.get()

  loggedInInstances[instanceName] = {
    access_token: accessToken
  }

  if (!loggedInInstancesInOrder.includes(instanceName)) {
    loggedInInstancesInOrder.push(instanceName)
  }

  store.set({
    currentInstance: instanceName,
    loggedInInstances,
    loggedInInstancesInOrder
  })
  store.save()
  goto('/') // re-navigate without the URL params
}
