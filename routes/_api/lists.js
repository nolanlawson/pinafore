import { get } from '../_utils/ajax'

export function getLists(instanceName, accessToken) {
  let url = `https://${instanceName}/api/v1/lists`
  return get(url, {
    'Authorization': `Bearer ${accessToken}`
  })
}