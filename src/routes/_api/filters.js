import { get, DEFAULT_TIMEOUT, post, WRITE_TIMEOUT } from '../_utils/ajax'
import { auth, basename } from './utils'

export function getFilters (instanceName, accessToken) {
  const url = `${basename(instanceName)}/api/v1/filters`
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}

export function createFilter (instanceName, accessToken, filter) {
  const url = `${basename(instanceName)}/api/v1/filters`
  return post(url, filter, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
