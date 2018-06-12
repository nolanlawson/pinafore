import { get, paramsString, DEFAULT_TIMEOUT } from '../_utils/ajax'
import { auth, basename } from './utils'

export function getVerifyCredentials (instanceName, accessToken) {
  let url = `${basename(instanceName)}/api/v1/accounts/verify_credentials`
  return get(url, auth(accessToken), {timeout: DEFAULT_TIMEOUT})
}

export function getAccount (instanceName, accessToken, accountId) {
  let url = `${basename(instanceName)}/api/v1/accounts/${accountId}`
  return get(url, auth(accessToken), {timeout: DEFAULT_TIMEOUT})
}

export async function getRelationship (instanceName, accessToken, accountId) {
  let url = `${basename(instanceName)}/api/v1/accounts/relationships`
  url += '?' + paramsString({id: accountId})
  let res = await get(url, auth(accessToken), {timeout: DEFAULT_TIMEOUT})
  return res[0]
}
