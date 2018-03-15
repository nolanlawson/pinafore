import { getWithTimeout, postWithTimeout } from '../_utils/ajax'
import { auth, basename } from '../_api/utils'

export async function getFollowRequests (instanceName, accessToken) {
  let url = `${basename(instanceName)}/api/v1/follow_requests`
  return getWithTimeout(url, auth(accessToken))
}

export async function authorizeFollowRequest (instanceName, accessToken, id) {
  let url = `${basename(instanceName)}/api/v1/follow_requests/${id}/authorize`
  return postWithTimeout(url, null, auth(accessToken))
}

export async function rejectFollowRequest (instanceName, accessToken, id) {
  let url = `${basename(instanceName)}/api/v1/follow_requests/${id}/reject`
  return postWithTimeout(url, null, auth(accessToken))
}
