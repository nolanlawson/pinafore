import { auth, basename } from './utils.js'
import { post, WRITE_TIMEOUT } from '../_utils/ajax.js'

export async function blockAccount (instanceName, accessToken, accountId) {
  const url = `${basename(instanceName)}/api/v1/accounts/${accountId}/block`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export async function unblockAccount (instanceName, accessToken, accountId) {
  const url = `${basename(instanceName)}/api/v1/accounts/${accountId}/unblock`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
