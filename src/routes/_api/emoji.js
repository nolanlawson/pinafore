import { basename } from './utils.js'
import { DEFAULT_TIMEOUT, get } from '../_utils/ajax.js'

export async function getCustomEmoji (instanceName) {
  let url = `${basename(instanceName)}/api/v1/custom_emojis`
  return get(url, null, { timeout: DEFAULT_TIMEOUT })
}
