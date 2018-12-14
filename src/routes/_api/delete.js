import { auth, basename } from './utils.js'
import { del, WRITE_TIMEOUT } from '../_utils/ajax.js'

export async function deleteStatus (instanceName, accessToken, statusId) {
  let url = `${basename(instanceName)}/api/v1/statuses/${statusId}`
  return del(url, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
