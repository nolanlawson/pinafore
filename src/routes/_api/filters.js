import { get, DEFAULT_TIMEOUT, post, WRITE_TIMEOUT, put } from '../_utils/ajax'
import { auth, basename } from './utils'

export function getFilters (instanceName, accessToken) {
  const url = `${basename(instanceName)}/api/v1/filters`
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}

export function createFilter (instanceName, accessToken, filter) {
  const url = `${basename(instanceName)}/api/v1/filters`
  return post(url, filter, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export function updateFilter (instanceName, accessToken, filter) {
  const url = `${basename(instanceName)}/api/v1/filters/${filter.id}`
  return put(url, filter, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
