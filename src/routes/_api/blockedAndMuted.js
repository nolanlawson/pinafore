import { DEFAULT_TIMEOUT, get, paramsString } from '../_utils/ajax.js'
import { auth, basename } from './utils.js'

export async function getBlockedAccounts (instanceName, accessToken, limit = 80) {
  let url = `${basename(instanceName)}/api/v1/blocks`
  url += '?' + paramsString({ limit })
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}

export async function getMutedAccounts (instanceName, accessToken, limit = 80) {
  let url = `${basename(instanceName)}/api/v1/mutes`
  url += '?' + paramsString({ limit })
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}
