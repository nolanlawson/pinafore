import { get, paramsString } from '../_utils/ajax'
import { basename } from './utils'

export function getVerifyCredentials (instanceName, accessToken) {
  let url = `${basename(instanceName)}/api/v1/accounts/verify_credentials`
  return get(url, {
    'Authorization': `Bearer ${accessToken}`
  })
}

export function getAccount (instanceName, accessToken, accountId) {
  let url = `${basename(instanceName)}/api/v1/accounts/${accountId}`
  return get(url, {
    'Authorization': `Bearer ${accessToken}`
  })
}

export async function getRelationship (instanceName, accessToken, accountId) {
  let url = `${basename(instanceName)}/api/v1/accounts/relationships`
  url += '?' + paramsString({id: accountId})
  let res = await get(url, {
    'Authorization': `Bearer ${accessToken}`
  })
  return res[0]
}
