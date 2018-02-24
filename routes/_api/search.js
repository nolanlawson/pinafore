import { getWithTimeout, paramsString } from '../_utils/ajax'
import { basename } from './utils'

export function search (instanceName, accessToken, query) {
  let url = `${basename(instanceName)}/api/v1/search?` + paramsString({
    q: query,
    resolve: true
  })
  return getWithTimeout(url, {
    'Authorization': `Bearer ${accessToken}`
  })
}
