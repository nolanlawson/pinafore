import { get, paramsString } from '../ajax'
import { basename } from './utils'

export function getHomeTimeline(instanceName, accessToken, maxId, since) {
  let url = `${basename(instanceName)}/api/v1/timelines/home`

  let params = {}
  if (since) {
    params.since = since
  }

  if (maxId) {
    params.max_id = maxId
  }

  url += '?' + paramsString(params)

  return get(url, {
    'Authorization': `Bearer ${accessToken}`
  })
}