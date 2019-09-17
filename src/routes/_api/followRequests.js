import { DEFAULT_TIMEOUT, get, post, WRITE_TIMEOUT } from '../_utils/ajax'
import { auth, basename } from './utils'

export async function getFollowRequests (instanceName, accessToken) {
  const url = `${basename(instanceName)}/api/v1/follow_requests`
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}

export async function authorizeFollowRequest (instanceName, accessToken, id) {
  const url = `${basename(instanceName)}/api/v1/follow_requests/${id}/authorize`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export async function rejectFollowRequest (instanceName, accessToken, id) {
  const url = `${basename(instanceName)}/api/v1/follow_requests/${id}/reject`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
