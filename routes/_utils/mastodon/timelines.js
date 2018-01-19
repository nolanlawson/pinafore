import { get, paramsString } from '../ajax'
import { basename } from './utils'

export function getTimeline(instanceName, accessToken, timeline, maxId, since) {
  let timelineUrlName = timeline === 'local' || timeline === 'federated' ?  'public' : timeline
  let url = `${basename(instanceName)}/api/v1/timelines/${timelineUrlName}`

  let params = {}
  if (since) {
    params.since = since
  }

  if (maxId) {
    params.max_id = maxId
  }

  if (timeline === 'local') {
    params.local = true
  }

  url += '?' + paramsString(params)

  return get(url, {
    'Authorization': `Bearer ${accessToken}`
  })
}