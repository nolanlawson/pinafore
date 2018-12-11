import { get, paramsString, DEFAULT_TIMEOUT } from '../_utils/ajax'
import { auth, basename } from './utils'

export async function getPinnedStatuses (instanceName, accessToken, accountId) {
  let url = `${basename(instanceName)}/api/v1/accounts/${accountId}/statuses`
  url += '?' + paramsString({
    limit: 40,
    pinned: true
  })
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}
