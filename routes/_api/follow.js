import { postWithTimeout } from '../_utils/ajax'
import { auth, basename } from './utils'

export async function followAccount(instanceName, accessToken, accountId) {
  let url = `${basename(instanceName)}/api/v1/accounts/${accountId}/follow`
  return postWithTimeout(url, null, auth(accessToken))
}

export async function unfollowAccount(instanceName, accessToken, accountId) {
  let url = `${basename(instanceName)}/api/v1/accounts/${accountId}/unfollow`
  return postWithTimeout(url, null, auth(accessToken))
}