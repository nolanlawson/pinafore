import { get, paramsString } from '../ajax'

export function search(instanceName, accessToken, query) {
  let url = `https://${instanceName}/api/v1/search?` + paramsString({
    q: query,
    resolve: true
  })
  return get(url, {
    'Authorization': `Bearer ${accessToken}`
  })
}

