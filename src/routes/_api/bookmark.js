import { post, WRITE_TIMEOUT } from '../_utils/ajax'
import { auth, basename } from './utils'

export async function bookmarkStatus (instanceName, accessToken, statusId) {
  const url = `${basename(instanceName)}/api/v1/statuses/${statusId}/bookmark`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export async function unbookmarkStatus (instanceName, accessToken, statusId) {
  const url = `${basename(instanceName)}/api/v1/statuses/${statusId}/unbookmark`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
