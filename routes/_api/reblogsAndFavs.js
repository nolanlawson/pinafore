import { get, paramsString } from '../_utils/ajax'

// TODO: paginate

export async function getReblogs(instanceName, accessToken, statusId, limit = 80) {
  let url = `https://${instanceName}/api/v1/statuses/${statusId}/reblogged_by`
  url += '?' + paramsString({ limit })
  return get(url, {
    'Authorization': `Bearer ${accessToken}`
  })
}

export async function getFavorites(instanceName, accessToken, statusId, limit = 80) {
  let url = `https://${instanceName}/api/v1/statuses/${statusId}/favourited_by`
  url += '?' + paramsString({ limit })
  return get(url, {
    'Authorization': `Bearer ${accessToken}`
  })
}