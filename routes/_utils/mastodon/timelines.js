import { get, paramsString } from '../ajax'
import { basename } from './utils'

function getTimelineUrlPath(timeline) {
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
  } else if (timeline.startsWith('status/')) {
    return 'statuses'
  } else if (timeline.startsWith('account/')) {
    return 'accounts'
  }
}

export function getTimeline(instanceName, accessToken, timeline, maxId, since) {
  let timelineUrlName = getTimelineUrlPath(timeline)
  let url = `${basename(instanceName)}/api/v1/${timelineUrlName}`

  if (timeline.startsWith('tag/')) {
    url += '/' + timeline.split('/').slice(-1)[0]
  } else if (timeline.startsWith('status/')) {
    url += '/' + timeline.split('/').slice(-1)[0] + '/context'
  } else if (timeline.startsWith('account/')) {
    url += '/' + timeline.split('/').slice(-1)[0] +'/statuses'
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

  if (timeline.startsWith('status/')) {
    // special case - this is a list of descendents and ancestors
    let statusUrl = `${basename(instanceName)}/api/v1/statuses/${timeline.split('/').slice(-1)[0]}}`
    return Promise.all([
      get(url, {'Authorization': `Bearer ${accessToken}`}),
      get(statusUrl, {'Authorization': `Bearer ${accessToken}`})
    ]).then(res => {
      return [].concat(res[0].ancestors).concat([res[1]]).concat(res[0].descendants)
    })
  }

  return get(url, {
    'Authorization': `Bearer ${accessToken}`
  })
}