import { auth, basename } from './utils.js'
import { DEFAULT_TIMEOUT, get } from '../_utils/ajax.js'

export function getCustomEmoji (instanceName, accessToken) {
  const url = `${basename(instanceName)}/api/v1/custom_emojis`
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}
