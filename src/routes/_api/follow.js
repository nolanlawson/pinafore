import { post, WRITE_TIMEOUT } from '../_utils/ajax'
import { auth, basename } from './utils'

export async function followAccount (instanceName, accessToken, accountId) {
  const url = `${basename(instanceName)}/api/v1/accounts/${accountId}/follow`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export async function unfollowAccount (instanceName, accessToken, accountId) {
  const url = `${basename(instanceName)}/api/v1/accounts/${accountId}/unfollow`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
