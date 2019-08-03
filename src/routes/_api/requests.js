import { post, WRITE_TIMEOUT } from '../_utils/ajax'
import { auth, basename } from './utils'

export async function approveFollowRequest (instanceName, accessToken, accountId) {
  const url = `${basename(instanceName)}/api/v1/follow_requests/${accountId}/authorize`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export async function rejectFollowRequest (instanceName, accessToken, accountId) {
  const url = `${basename(instanceName)}/api/v1/follow_requests/${accountId}/reject`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
