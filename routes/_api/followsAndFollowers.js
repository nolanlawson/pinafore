import { getWithTimeout, paramsString } from '../_utils/ajax'
import { auth, basename } from './utils'

export async function getFollows (instanceName, accessToken, accountId, limit = 80) {
  let url = `${basename(instanceName)}/api/v1/accounts/${accountId}/following`
  url += '?' + paramsString({ limit })
  return getWithTimeout(url, auth(accessToken))
}

export async function getFollowers (instanceName, accessToken, accountId, limit = 80) {
  let url = `${basename(instanceName)}/api/v1/accounts/${accountId}/followers`
  url += '?' + paramsString({ limit })
  return getWithTimeout(url, auth(accessToken))
}
