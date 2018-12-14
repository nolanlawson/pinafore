import { get, DEFAULT_TIMEOUT } from '../_utils/ajax.js'
import { auth, basename } from './utils.js'

export function getLists (instanceName, accessToken) {
  let url = `${basename(instanceName)}/api/v1/lists`
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}
