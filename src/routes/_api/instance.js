import { get, DEFAULT_TIMEOUT } from '../_utils/ajax.js'
import { auth, basename } from './utils.js'

export function getInstanceInfo (instanceName, accessToken) {
  const url = `${basename(instanceName)}/api/v1/instance`
  // accessToken is required in limited federation mode, but elsewhere we don't need it (e.g. during login)
  const headers = accessToken ? auth(accessToken) : null
  return get(url, headers, { timeout: DEFAULT_TIMEOUT })
}
