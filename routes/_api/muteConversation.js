import { auth, basename } from './utils'
import { postWithTimeout } from '../_utils/ajax'

export async function muteConversation (instanceName, accessToken, statusId) {
  let url = `${basename(instanceName)}/api/v1/statuses/${statusId}/mute`
  return postWithTimeout(url, null, auth(accessToken))
}

export async function unmuteConversation (instanceName, accessToken, statusId) {
  let url = `${basename(instanceName)}/api/v1/statuses/${statusId}/unmute`
  return postWithTimeout(url, null, auth(accessToken))
}
