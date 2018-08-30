import { get, paramsString, DEFAULT_TIMEOUT } from '../_utils/ajax'
import { auth, basename } from './utils'

export async function getFollows (instanceName, accessToken, accountId, limit = 80) {
  let url = `${basename(instanceName)}/api/v1/accounts/${accountId}/following`
  url += '?' + paramsString({ limit })
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}

export async function getFollowers (instanceName, accessToken, accountId, limit = 80) {
  let url = `${basename(instanceName)}/api/v1/accounts/${accountId}/followers`
  url += '?' + paramsString({ limit })
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}
