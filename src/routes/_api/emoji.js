import { basename } from './utils'
import { DEFAULT_TIMEOUT, get } from '../_utils/ajax'

export async function getCustomEmoji (instanceName) {
  let url = `${basename(instanceName)}/api/v1/custom_emojis`
  return get(url, null, { timeout: DEFAULT_TIMEOUT })
}
