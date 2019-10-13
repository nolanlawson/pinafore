import { get, paramsString, DEFAULT_TIMEOUT } from '../_utils/ajax'
import { auth, basename } from './utils'

function doSearch (version, instanceName, accessToken, query, resolve, limit, excludeUnreviewed, signal) {
  const url = `${basename(instanceName)}/api/${version}/search?` + paramsString({
    q: query,
    resolve,
    limit,
    exclude_unreviewed: !!excludeUnreviewed
  })
  return get(url, auth(accessToken), {
    timeout: DEFAULT_TIMEOUT,
    signal
  })
}

async function doSearchV1 (instanceName, accessToken, query, resolve, limit, excludeUnreviewed, signal) {
  const resp = await doSearch('v1', instanceName, accessToken, query, resolve, limit, excludeUnreviewed, signal)
  resp.hashtags = resp.hashtags && resp.hashtags.map(tag => ({
    name: tag,
    url: `${basename(instanceName)}/tags/${tag.toLowerCase()}`,
    history: []
  }))
  return resp
}

async function doSearchV2 (instanceName, accessToken, query, resolve, limit, excludeUnreviewed, signal) {
  return doSearch('v2', instanceName, accessToken, query, resolve, limit, excludeUnreviewed, signal)
}

export async function search (instanceName, accessToken, query, resolve = true, limit = 5,
  excludeUnreviewed = false, signal = null) {
  try {
    return (await doSearchV2(instanceName, accessToken, query, resolve, limit, excludeUnreviewed, signal))
  } catch (err) {
    if (err && err.status === 404) { // fall back to old search API
      return doSearchV1(instanceName, accessToken, query, resolve, limit, excludeUnreviewed, signal)
    } else {
      throw err
    }
  }
}
