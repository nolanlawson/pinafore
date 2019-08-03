import { auth, basename } from './utils'
import { post, WRITE_TIMEOUT } from '../_utils/ajax'

export async function muteConversation (instanceName, accessToken, statusId) {
  const url = `${basename(instanceName)}/api/v1/statuses/${statusId}/mute`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export async function unmuteConversation (instanceName, accessToken, statusId) {
  const url = `${basename(instanceName)}/api/v1/statuses/${statusId}/unmute`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
