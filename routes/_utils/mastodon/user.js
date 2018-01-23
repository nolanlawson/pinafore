import { get } from '../ajax'
import { basename } from './utils'

export function getVerifyCredentials(instanceName, accessToken) {
  let url = `${basename(instanceName)}/api/v1/accounts/verify_credentials`
  return get(url, {
    'Authorization': `Bearer ${accessToken}`
  })
}

export function getAccount(instanceName, accessToken, accountId) {
  let url = `${basename(instanceName)}/api/v1/accounts/${accountId}`
  return get(url, {
    'Authorization': `Bearer ${accessToken}`
  })
}