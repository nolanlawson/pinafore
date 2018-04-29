import { postWithTimeout } from '../_utils/ajax'
import { auth, basename } from './utils'

export async function pinStatus (instanceName, accessToken, statusId) {
  let url = `${basename(instanceName)}/api/v1/statuses/${statusId}/pin`
  return postWithTimeout(url, null, auth(accessToken))
}

export async function unpinStatus (instanceName, accessToken, statusId) {
  let url = `${basename(instanceName)}/api/v1/statuses/${statusId}/unpin`
  return postWithTimeout(url, null, auth(accessToken))
}
