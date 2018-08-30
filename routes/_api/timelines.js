import { get, paramsString, DEFAULT_TIMEOUT } from '../_utils/ajax'
import { auth, basename } from './utils'

function getTimelineUrlPath (timeline) {
  switch (timeline) {
    case 'local':
    case 'federated':
      return 'timelines/public'
    case 'home':
      return 'timelines/home'
    case 'notifications':
      return 'notifications'
    case 'favorites':
      return 'favourites'
  }
  if (timeline.startsWith('tag/')) {
    return 'timelines/tag'
  } else if (timeline.startsWith('account/')) {
    return 'accounts'
  } else if (timeline.startsWith('list/')) {
    return 'timelines/list'
  }
}

export function getTimeline (instanceName, accessToken, timeline, maxId, since, limit) {
  let timelineUrlName = getTimelineUrlPath(timeline)
  let url = `${basename(instanceName)}/api/v1/${timelineUrlName}`

  if (timeline.startsWith('tag/')) {
    url += '/' + timeline.split('/').slice(-1)[0]
  } else if (timeline.startsWith('account/')) {
    url += '/' + timeline.split('/').slice(-1)[0] + '/statuses'
  } else if (timeline.startsWith('list/')) {
    url += '/' + timeline.split('/').slice(-1)[0]
  }

  let params = {}
  if (since) {
    params.since = since
  }

  if (maxId) {
    params.max_id = maxId
  }

  if (limit) {
    params.limit = limit
  }

  if (timeline === 'local') {
    params.local = true
  }

  url += '?' + paramsString(params)

  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}
