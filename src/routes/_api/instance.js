import { get, DEFAULT_TIMEOUT } from '../_utils/ajax'
import { basename } from './utils'

export function getInstanceInfo (instanceName) {
  const url = `${basename(instanceName)}/api/v1/instance`
  return get(url, null, { timeout: DEFAULT_TIMEOUT })
}

export function getOnlineMode (instanceName) {
  const url = 'https://mastodon.social/api/v1/instance' // Check online mode only since /api/v1/instance requires authentication in whitelist mode
  return get(url, null, { timeout: DEFAULT_TIMEOUT })
}
