import { auth, basename } from './utils'
import { post, put, get, del } from '../_utils/ajax'

export async function postSubscription (instanceName, accessToken, subscription, alerts) {
  const url = `${basename(instanceName)}/api/v1/push/subscription`

  return post(url, { subscription: subscription.toJSON(), data: { alerts } }, auth(accessToken))
}

export async function putSubscription (instanceName, accessToken, alerts) {
  const url = `${basename(instanceName)}/api/v1/push/subscription`

  return put(url, { data: { alerts } }, auth(accessToken))
}

export async function getSubscription (instanceName, accessToken) {
  const url = `${basename(instanceName)}/api/v1/push/subscription`

  return get(url, auth(accessToken))
}

export async function deleteSubscription (instanceName, accessToken) {
  const url = `${basename(instanceName)}/api/v1/push/subscription`

  return del(url, auth(accessToken))
}
