import { post, WRITE_TIMEOUT } from '../_utils/ajax'
import { auth, basename } from './utils'

export async function pinStatus (instanceName, accessToken, statusId) {
  const url = `${basename(instanceName)}/api/v1/statuses/${statusId}/pin`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export async function unpinStatus (instanceName, accessToken, statusId) {
  const url = `${basename(instanceName)}/api/v1/statuses/${statusId}/unpin`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
