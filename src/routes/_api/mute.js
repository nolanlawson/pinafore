import { auth, basename } from './utils.js'
import { post, WRITE_TIMEOUT } from '../_utils/ajax.js'

export async function muteAccount (instanceName, accessToken, accountId) {
  let url = `${basename(instanceName)}/api/v1/accounts/${accountId}/mute`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export async function unmuteAccount (instanceName, accessToken, accountId) {
  let url = `${basename(instanceName)}/api/v1/accounts/${accountId}/unmute`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
