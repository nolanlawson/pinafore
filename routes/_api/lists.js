import { getWithTimeout } from '../_utils/ajax'
import { auth, basename } from './utils'

export function getLists (instanceName, accessToken) {
  let url = `${basename(instanceName)}/api/v1/lists`
  return getWithTimeout(url, auth(accessToken))
}
