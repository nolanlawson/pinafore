import { auth, basename } from './utils'
import { postWithTimeout } from '../_utils/ajax'

export async function muteAccount (instanceName, accessToken, accountId) {
  let url = `${basename(instanceName)}/api/v1/accounts/${accountId}/mute`
  return postWithTimeout(url, null, auth(accessToken))
}

export async function unmuteAccount (instanceName, accessToken, accountId) {
  let url = `${basename(instanceName)}/api/v1/accounts/${accountId}/unmute`
  return postWithTimeout(url, null, auth(accessToken))
}
