import { getWithTimeout, paramsString } from '../_utils/ajax'
import { basename } from './utils'

export async function getBlockedAccounts (instanceName, accessToken, limit = 80) {
  let url = `${basename(instanceName)}/api/v1/blocks`
  url += '?' + paramsString({ limit })
  return getWithTimeout(url, {
    'Authorization': `Bearer ${accessToken}`
  })
}

export async function getMutedAccounts (instanceName, accessToken, limit = 80) {
  let url = `${basename(instanceName)}/api/v1/mutes`
  url += '?' + paramsString({ limit })
  return getWithTimeout(url, {
    'Authorization': `Bearer ${accessToken}`
  })
}
