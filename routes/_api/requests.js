import { postWithTimeout } from '../_utils/ajax'
import { auth, basename } from './utils'

export async function approveFollowRequest (instanceName, accessToken, accountId) {
  let url = `${basename(instanceName)}/api/v1/follow_requests/${accountId}/authorize`
  return postWithTimeout(url, null, auth(accessToken))
}

export async function rejectFollowRequest (instanceName, accessToken, accountId) {
  let url = `${basename(instanceName)}/api/v1/follow_requests/${accountId}/reject`
  return postWithTimeout(url, null, auth(accessToken))
}
