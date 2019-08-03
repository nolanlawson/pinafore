import WebSocketClient from '@gamestdio/websocket'
import lifecycle from 'page-lifecycle/dist/lifecycle.mjs'
import { getStreamUrl } from './getStreamUrl'
import { EventEmitter } from 'events-light'
import { eventBus } from '../../_utils/eventBus'

export class TimelineStream extends EventEmitter {
  constructor (streamingApi, accessToken, timeline) {
    super()
    this._streamingApi = streamingApi
    this._accessToken = accessToken
    this._timeline = timeline
    this._onStateChange = this._onStateChange.bind(this)
    this._onOnlineForced = this._onOnlineForced.bind(this)
    this._setupWebSocket()
    this._setupEvents()
  }

  close () {
    this._closed = true
    this._closeWebSocket()
    this._teardownEvents()
    // events-light currently does not support removeAllListeners()
    // https://github.com/patrick-steele-idem/events-light/issues/2
    for (const event of ['open', 'close', 'reconnect', 'message']) {
      this.removeAllListeners(event)
    }
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

  _setupEvents () {
    lifecycle.addEventListener('statechange', this._onStateChange)
    eventBus.on('forcedOnline', this._onOnlineForced)
  }

  _teardownEvents () {
    lifecycle.removeEventListener('statechange', this._onStateChange)
    eventBus.removeListener('forcedOnline', this._onOnlineForced)
  }

  _pause () {
    if (this._closed) {
      return
    }
    this._closeWebSocket()
  }

  _unpause () {
    if (this._closed) {
      return
    }
    this._closeWebSocket()
    this._setupWebSocket()
  }

  _onStateChange (event) {
    // when the page enters or exits a frozen state, pause or resume websocket polling
    if (event.newState === 'frozen') { // page is frozen
      console.log('frozen')
      this._pause()
    } else if (event.oldState === 'frozen') { // page is unfrozen
      console.log('unfrozen')
      this._unpause()
    }
  }

  _onOnlineForced (online) {
    if (online) {
      console.log('online forced')
      this._unpause()
    } else {
      console.log('offline forced')
      this._pause()
    }
  }
}
