import { paramsString } from '../_utils/ajax'
import noop from 'lodash-es/noop'
import { importWebSocketClient } from '../_utils/asyncModules'

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
  }
  if (timeline.startsWith('tag/')) {
    return 'hashtag'
  }
  if (timeline.startsWith('list/')) {
    return 'list'
  }
}

function getUrl (streamingApi, accessToken, timeline) {
  let url = `${streamingApi}/api/v1/streaming`
  let streamName = getStreamName(timeline)

  let params = {
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

export class TimelineStream {
  constructor (streamingApi, accessToken, timeline, opts) {
    let url = getUrl(streamingApi, accessToken, timeline)
    importWebSocketClient().then(WebSocketClient => {
      if (this.__closed) {
        return
      }
      const ws = new WebSocketClient(url, null, { backoff: 'exponential' })
      const onMessage = opts.onMessage || noop

      ws.onopen = opts.onOpen || noop
      ws.onmessage = e => onMessage(JSON.parse(e.data))
      ws.onclose = opts.onClose || noop
      ws.onreconnect = opts.onReconnect || noop

      this._ws = ws
    })
  }

  close () {
    this.__closed = true
    if (this._ws) {
      this._ws.close()
    }
  }
}
