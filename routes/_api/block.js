import { auth, basename } from './utils'
import { postWithTimeout } from '../_utils/ajax'

export async function blockAccount (instanceName, accessToken, accountId) {
  let url = `${basename(instanceName)}/api/v1/accounts/${accountId}/block`
  return postWithTimeout(url, null, auth(accessToken))
}

export async function unblockAccount (instanceName, accessToken, accountId) {
  let url = `${basename(instanceName)}/api/v1/accounts/${accountId}/unblock`
  return postWithTimeout(url, null, auth(accessToken))
}
