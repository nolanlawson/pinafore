import { DEFAULT_TIMEOUT, get, post, WRITE_TIMEOUT } from '../_utils/ajax.js'
import { auth, basename } from '../_api/utils.js'

export async function getFollowRequests (instanceName, accessToken) {
  let url = `${basename(instanceName)}/api/v1/follow_requests`
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}

export async function authorizeFollowRequest (instanceName, accessToken, id) {
  let url = `${basename(instanceName)}/api/v1/follow_requests/${id}/authorize`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export async function rejectFollowRequest (instanceName, accessToken, id) {
  let url = `${basename(instanceName)}/api/v1/follow_requests/${id}/reject`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
