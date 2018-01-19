import { get } from '../ajax'
import { basename } from './utils'

export function getThisUserAccount(instanceName, accessToken) {
  let url = `${basename(instanceName)}/api/v1/accounts/verify_credentials`
  return get(url, {
    'Authorization': `Bearer ${accessToken}`
  })
}