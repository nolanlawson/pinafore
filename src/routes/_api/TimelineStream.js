import { paramsString } from '../_utils/ajax'
import noop from 'lodash-es/noop'
import WebSocketClient from '@gamestdio/websocket'
import lifecycle from 'page-lifecycle/dist/lifecycle.mjs'

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
    this._streamingApi = streamingApi
    this._accessToken = accessToken
    this._timeline = timeline
    this._opts = opts
    this._onStateChange = this._onStateChange.bind(this)
    this._setupWebSocket()
    this._setupLifecycle()
  }

  close () {
    this._closed = true
    this._closeWebSocket()
    this._teardownLifecycle()
  }

  _closeWebSocket () {
    if (this._ws) {
      this._ws.close()
      this._ws = null
    }
  }

  _setupWebSocket () {
    const url = getUrl(this._streamingApi, this._accessToken, this._timeline)
    const ws = new WebSocketClient(url, null, { backoff: 'fibonacci' })

    ws.onopen = this._opts.onOpen || noop
    ws.onmessage = this._opts.onMessage ? e => this._opts.onMessage(JSON.parse(e.data)) : noop
    ws.onclose = this._opts.onClose || noop
    ws.onreconnect = this._opts.onReconnect || noop

    this._ws = ws
  }

  _setupLifecycle () {
    lifecycle.addEventListener('statechange', this._onStateChange)
  }

  _teardownLifecycle () {
    lifecycle.removeEventListener('statechange', this._onStateChange)
  }

  _onStateChange (event) {
    if (this._closed) {
      return
    }
    // when the page enters or exits a frozen state, pause or resume websocket polling
    if (event.newState === 'frozen') { // page is frozen
      console.log('frozen')
      this._closeWebSocket()
    } else if (event.oldState === 'frozen') { // page is unfrozen
      console.log('unfrozen')
      this._closeWebSocket()
      this._setupWebSocket()
    }
  }
}
