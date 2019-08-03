import { post, WRITE_TIMEOUT } from '../_utils/ajax'
import { basename, auth } from './utils'

export async function favoriteStatus (instanceName, accessToken, statusId) {
  const url = `${basename(instanceName)}/api/v1/statuses/${statusId}/favourite`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export async function unfavoriteStatus (instanceName, accessToken, statusId) {
  const url = `${basename(instanceName)}/api/v1/statuses/${statusId}/unfavourite`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
