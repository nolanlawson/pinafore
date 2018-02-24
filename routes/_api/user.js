import { getWithTimeout, paramsString } from '../_utils/ajax'
import { auth, basename } from './utils'

export function getVerifyCredentials (instanceName, accessToken) {
  let url = `${basename(instanceName)}/api/v1/accounts/verify_credentials`
  return getWithTimeout(url, auth(accessToken))
}

export function getAccount (instanceName, accessToken, accountId) {
  let url = `${basename(instanceName)}/api/v1/accounts/${accountId}`
  return getWithTimeout(url, auth(accessToken))
}

export async function getRelationship (instanceName, accessToken, accountId) {
  let url = `${basename(instanceName)}/api/v1/accounts/relationships`
  url += '?' + paramsString({id: accountId})
  let res = await getWithTimeout(url, auth(accessToken))
  return res[0]
}
