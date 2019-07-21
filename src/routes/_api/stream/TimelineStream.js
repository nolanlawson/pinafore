import WebSocketClient from '@gamestdio/websocket'
import lifecycle from 'page-lifecycle/dist/lifecycle.mjs'
import { getStreamUrl } from './getStreamUrl'
import { EventEmitter } from 'events-light'

export class TimelineStream extends EventEmitter {
  constructor (streamingApi, accessToken, timeline) {
    super()
    this._streamingApi = streamingApi
    this._accessToken = accessToken
    this._timeline = timeline
    this._onStateChange = this._onStateChange.bind(this)
    this._setupWebSocket()
    this._setupLifecycle()
  }

  close () {
    this._closed = true
    this._closeWebSocket()
    this._teardownLifecycle()
    this.removeAllListeners()
  }

  _closeWebSocket () {
    if (this._ws) {
      this.emit('close')
      this._ws.onopen = null
      this._ws.onmessage = null
      this._ws.onclose = null
      this._ws.close()
      this._ws = null
    }
  }

  _setupWebSocket () {
    const url = getStreamUrl(this._streamingApi, this._accessToken, this._timeline)
    const ws = new WebSocketClient(url, null, { backoff: 'fibonacci' })

    ws.onopen = () => {
      if (!this._opened) {
        this.emit('open')
        this._opened = true
      } else {
        // we may close or reopen websockets due to freeze/unfreeze events
        // and we want to fire "reconnect" rather than "open" in that case
        this.emit('reconnect')
      }
    }
    ws.onmessage = (e) => this.emit('message', JSON.parse(e.data))
    ws.onclose = () => this.emit('close')
    // The ws "onreconnect" event seems unreliable. When the server goes down and comes back up,
    // it doesn't fire (but "open" does). When we freeze and unfreeze, it fires along with the
    // "open" event. The above is my attempt to normalize it.

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
