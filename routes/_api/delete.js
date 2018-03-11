import { auth, basename } from './utils'
import { deleteWithTimeout } from '../_utils/ajax'

export async function deleteStatus (instanceName, accessToken, statusId) {
  let url = `${basename(instanceName)}/api/v1/statuses/${statusId}`
  return deleteWithTimeout(url, auth(accessToken))
}
