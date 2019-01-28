import { paramsString, DEFAULT_TIMEOUT, getWithResponse } from '../_utils/ajax'
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

function parseLinkHeader (response) {
  // the timeline API includes something like:
  // <https://example.com/api/v1/favourites?limit=20&max_id=82816>; rel="next",
  // <https://example.com/api/v1/favourites?limit=20&min_id=89916>; rel="prev"
  // from which we figure out the max ID and min ID
  let link = response.getHeaders().get('link')
  let links = link.split(',').map(_ => {
    let [ urlString, relString ] = _.split(';')
    let url = new URL(urlString.substring(1, url.length - 1))
    let rel = relString.match(/rel=['"](.*?)['"]/)[1]
    let searchParams = new URLSearchParams(url.search)
    return { rel, searchParams }
  })
  let minId = links.find(({ rel }) => rel === 'prev').searchParams.get('min_id')
  let maxId = links.find(({ rel }) => rel === 'next').searchParams.get('max_id')
  return [ minId, maxId ]
}

export async function getTimeline (instanceName, accessToken, timeline, maxId, since, limit) {
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

  let { response, json } = await getWithResponse(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
  let [ min, max ] = parseLinkHeader(response)

  return { maxId: max, minId: min, json }
}
