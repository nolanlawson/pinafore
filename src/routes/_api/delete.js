import { auth, basename } from './utils'
import { del, WRITE_TIMEOUT } from '../_utils/ajax'

export async function deleteStatus (instanceName, accessToken, statusId) {
  const url = `${basename(instanceName)}/api/v1/statuses/${statusId}`
  return del(url, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
