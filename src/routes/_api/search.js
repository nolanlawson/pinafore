import { get, paramsString, DEFAULT_TIMEOUT } from '../_utils/ajax'
import { auth, basename } from './utils'

export function search (instanceName, accessToken, query, resolve = true, limit = 40, signal = null) {
  let url = `${basename(instanceName)}/api/v1/search?` + paramsString({
    q: query,
    resolve,
    limit
  })
  return get(url, auth(accessToken), {
    timeout: DEFAULT_TIMEOUT,
    signal
  })
}
