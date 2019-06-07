import { getSubscription, deleteSubscription, postSubscription, putSubscription } from '../_api/pushSubscription'
import { store } from '../_store/store'
import { urlBase64ToUint8Array } from '../_utils/base64'

const dummyApplicationServerKey = 'BImgAz4cF_yvNFp8uoBJCaGpCX4d0atNIFMHfBvAAXCyrnn9IMAFQ10DW_ZvBCzGeR4fZI5FnEi2JVcRE-L88jY='

export async function updatePushSubscriptionForInstance (instanceName) {
  const { loggedInInstances, currentPushSubscription } = store.get()
  const accessToken = loggedInInstances[instanceName].access_token

  if (currentPushSubscription === null) {
    return
  }

  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.getSubscription()

  if (subscription === null) {
    store.setInstanceData(instanceName, 'pushSubscriptions', null)
    store.save()
    return
  }

  try {
    const backendSubscription = await getSubscription(instanceName, accessToken)

    // Check if applicationServerKey changed (need to get another subscription from the browser)
    if (btoa(urlBase64ToUint8Array(backendSubscription.server_key).buffer) !== btoa(subscription.options.applicationServerKey)) {
      await subscription.unsubscribe()
      await deleteSubscription(instanceName, accessToken)
      await updateAlerts(instanceName, currentPushSubscription.alerts)
    } else {
      store.setInstanceData(instanceName, 'pushSubscriptions', backendSubscription)
      store.save()
    }
  } catch (e) {
    // TODO: Better way to detect 404
    if (e.message.startsWith('404:')) {
      await subscription.unsubscribe()
      store.setInstanceData(instanceName, 'pushSubscriptions', null)
      store.save()
    }
  }
}

export async function updateAlerts (instanceName, alerts) {
  const { loggedInInstances } = store.get()
  const accessToken = loggedInInstances[instanceName].access_token

  const registration = await navigator.serviceWorker.ready
  let subscription = await registration.pushManager.getSubscription()

  if (subscription === null) {
    // We need applicationServerKey in order to register a push subscription
    // but the API doesn't expose it as a constant (as it should).
    // So we need to register a subscription with a dummy applicationServerKey,
    // send it to the backend saves it and return applicationServerKey, which
    // we use to register a new subscription.
    // https://github.com/tootsuite/mastodon/issues/8785
    subscription = await registration.pushManager.subscribe({
      applicationServerKey: urlBase64ToUint8Array(dummyApplicationServerKey),
      userVisibleOnly: true
    })

    let backendSubscription = await postSubscription(instanceName, accessToken, subscription, alerts)

    await subscription.unsubscribe()

    subscription = await registration.pushManager.subscribe({
      applicationServerKey: urlBase64ToUint8Array(backendSubscription.server_key),
      userVisibleOnly: true
    })

    backendSubscription = await postSubscription(instanceName, accessToken, subscription, alerts)

    store.setInstanceData(instanceName, 'pushSubscriptions', backendSubscription)
    store.save()
  } else {
    try {
      const backendSubscription = await putSubscription(instanceName, accessToken, alerts)
      store.setInstanceData(instanceName, 'pushSubscriptions', backendSubscription)
      store.save()
    } catch (e) {
      const backendSubscription = await postSubscription(instanceName, accessToken, subscription, alerts)
      store.setInstanceData(instanceName, 'pushSubscriptions', backendSubscription)
      store.save()
    }
  }
}
