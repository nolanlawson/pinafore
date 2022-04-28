import { post, WRITE_TIMEOUT } from '../_utils/ajax.js'
import { auth, basename } from './utils.js'

export async function notifyAccount (instanceName, accessToken, accountId) {
  const url = `${basename(instanceName)}/api/v1/accounts/${accountId}/follow`
  return post(url, {
    notify: true
  }, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export async function denotifyAccount (instanceName, accessToken, accountId) {
  const url = `${basename(instanceName)}/api/v1/accounts/${accountId}/follow`
  return post(url, {
    notify: false
  }, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
