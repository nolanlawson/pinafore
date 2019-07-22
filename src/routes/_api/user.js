import { get, DEFAULT_TIMEOUT } from '../_utils/ajax'
import { auth, basename } from './utils'

export function getVerifyCredentials (instanceName, accessToken) {
  const url = `${basename(instanceName)}/api/v1/accounts/verify_credentials`
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}

export function getAccount (instanceName, accessToken, accountId) {
  const url = `${basename(instanceName)}/api/v1/accounts/${accountId}`
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}
