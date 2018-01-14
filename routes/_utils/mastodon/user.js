import { get } from '../ajax'

export function getThisUserAccount(instanceName, accessToken) {
  let url = `https://${instanceName}/api/v1/accounts/verify_credentials`
  return get(url, {
    'Authorization': `Bearer ${accessToken}`
  })
}