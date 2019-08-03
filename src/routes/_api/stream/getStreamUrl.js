import { paramsString } from '../../_utils/ajax'

function getStreamName (timeline) {
  switch (timeline) {
    case 'local':
      return 'public:local'
    case 'federated':
      return 'public'
    case 'home':
      return 'user'
    case 'notifications':
      return 'user:notification'
    case 'direct':
      return 'direct'
  }
  if (timeline.startsWith('tag/')) {
    return 'hashtag'
  }
  if (timeline.startsWith('list/')) {
    return 'list'
  }
}

export function getStreamUrl (streamingApi, accessToken, timeline) {
  const url = `${streamingApi}/api/v1/streaming`
  const streamName = getStreamName(timeline)

  const params = {
    stream: streamName
  }

  if (timeline.startsWith('tag/')) {
    params.tag = timeline.split('/').slice(-1)[0]
  } else if (timeline.startsWith('list/')) {
    params.list = timeline.split('/').slice(-1)[0]
  }

  if (accessToken) {
    params.access_token = accessToken
  }

  return url + '?' + paramsString(params)
}
