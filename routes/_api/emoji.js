import { basename } from './utils'
import { getWithTimeout } from '../_utils/ajax'

export async function getCustomEmoji (instanceName) {
  let url = `${basename(instanceName)}/api/v1/custom_emojis`
  return getWithTimeout(url)
}
