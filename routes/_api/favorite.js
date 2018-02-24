import { post } from '../_utils/ajax'
import { basename, auth } from './utils'

export async function favoriteStatus (instanceName, accessToken, statusId) {
  let url = `${basename(instanceName)}/api/v1/statuses/${statusId}/favourite`
  return post(url, null, auth(accessToken))
}

export async function unfavoriteStatus (instanceName, accessToken, statusId) {
  let url = `${basename(instanceName)}/api/v1/statuses/${statusId}/unfavourite`
  return post(url, null, auth(accessToken))
}
