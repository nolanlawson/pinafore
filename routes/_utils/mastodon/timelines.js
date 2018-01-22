import { get, paramsString } from '../ajax'
import { basename } from './utils'

function getTimelineUrlName(timeline) {
  switch (timeline) {
    case 'local':
    case 'federated':
      return 'public'
    case 'home':
      return 'home'
    default:
      return 'tag'
  }
}

export function getTimeline(instanceName, accessToken, timeline, maxId, since) {
  let timelineUrlName = getTimelineUrlName(timeline)
  let url = `${basename(instanceName)}/api/v1/timelines/${timelineUrlName}`

  if (timeline.startsWith('tag/')) {
    url += '/' + timeline.split('/').slice(-1)[0]
  }

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