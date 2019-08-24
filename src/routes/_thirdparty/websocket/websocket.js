// forked from https://github.com/gamestdio/websocket/blob/4111bfa/src/index.js

import { Backoff } from './backoff'

export class WebSocketClient {
  /**
   * @param url DOMString The URL to which to connect; this should be the URL to which the WebSocket server will respond.
   * @param protocols DOMString|DOMString[] Either a single protocol string or an array of protocol strings. These strings are used to indicate sub-protocols, so that a single server can implement multiple WebSocket sub-protocols (for example, you might want one server to be able to handle different types of interactions depending on the specified protocol). If you don't specify a protocol string, an empty string is assumed.
   * @param options options
   */
  constructor (url, protocols = null, options = {}) {
    this.url = url
    this.protocols = protocols

    this.reconnectEnabled = true
    this.listeners = {}

    this.backoff = new Backoff(this.onBackoffReady.bind(this))

    if (typeof (options.connect) === 'undefined' || options.connect) {
      this.open()
    }
  }

  open (reconnect = false) {
    this.isReconnect = reconnect

    // keep binaryType used on previous WebSocket connection
    const binaryType = this.ws && this.ws.binaryType

    this.ws = new WebSocket(this.url, this.protocols)
    this.ws.onclose = this.onCloseCallback.bind(this)
    this.ws.onerror = this.onErrorCallback.bind(this)
    this.ws.onmessage = this.onMessageCallback.bind(this)
    this.ws.onopen = this.onOpenCallback.bind(this)

    if (binaryType) {
      this.ws.binaryType = binaryType
    }
  }

  /**
   * @ignore
   */
  onBackoffReady () {
    this.open(true)
  }

  /**
   * @ignore
   */
  onCloseCallback (e) {
    if (!this.isReconnect && this.listeners.onclose) {
      this.listeners.onclose.apply(null, arguments)
    }
    if (this.reconnectEnabled && e.code < 3000) {
      this.backoff.backoff()
    }
  }

  /**
   * @ignore
   */
  onErrorCallback () {
    if (this.listeners.onerror) {
      this.listeners.onerror.apply(null, arguments)
    }
  }

  /**
   * @ignore
   */
  onMessageCallback () {
    if (this.listeners.onmessage) {
      this.listeners.onmessage.apply(null, arguments)
    }
  }

  /**
   * @ignore
   */
  onOpenCallback () {
    if (this.listeners.onopen) {
      this.listeners.onopen.apply(null, arguments)
    }

    if (this.isReconnect && this.listeners.onreconnect) {
      this.listeners.onreconnect.apply(null, arguments)
    }

    this.isReconnect = false
  }

  // Unused
  // /**
  //  * The number of bytes of data that have been queued using calls to send()
  //  * but not yet transmitted to the network. This value does not reset to zero
  //  * when the connection is closed; if you keep calling send(), this will
  //  * continue to climb.
  //  *
  //  * @type unsigned long
  //  * @readonly
  //  */
  // get bufferedAmount () { return this.ws.bufferedAmount }
  //
  /**
   * The current state of the connection; this is one of the Ready state constants.
   * @type unsigned short
   * @readonly
   */
  get readyState () { return this.ws.readyState }

  // Unused
  //
  // /**
  //  * A string indicating the type of binary data being transmitted by the
  //  * connection. This should be either "blob" if DOM Blob objects are being
  //  * used or "arraybuffer" if ArrayBuffer objects are being used.
  //  * @type DOMString
  //  */
  // get binaryType () { return this.ws.binaryType }
  //
  // set binaryType (binaryType) { this.ws.binaryType = binaryType }
  //
  // /**
  //  * The extensions selected by the server. This is currently only the empty
  //  * string or a list of extensions as negotiated by the connection.
  //  * @type DOMString
  //  */
  // get extensions () { return this.ws.extensions }
  //
  // set extensions (extensions) { this.ws.extensions = extensions }
  //
  // /**
  //  * A string indicating the name of the sub-protocol the server selected;
  //  * this will be one of the strings specified in the protocols parameter when
  //  * creating the WebSocket object.
  //  * @type DOMString
  //  */
  // get protocol () { return this.ws.protocol }
  //
  // set protocol (protocol) { this.ws.protocol = protocol }

  /**
   * Closes the WebSocket connection or connection attempt, if any. If the
   * connection is already CLOSED, this method does nothing.
   *
   * @param code A numeric value indicating the status code explaining why the connection is being closed. If this parameter is not specified, a default value of 1000 (indicating a normal "transaction complete" closure) is assumed. See the list of status codes on the CloseEvent page for permitted values.
   * @param reason A human-readable string explaining why the connection is closing. This string must be no longer than 123 bytes of UTF-8 text (not characters).
   *
   * @return void
   */
  close (code, reason) {
    if (typeof code === 'undefined') { code = 1000 }

    this.reconnectEnabled = false

    this.ws.close(code, reason)
  }

  /**
   * Transmits data to the server over the WebSocket connection.
   * @param data DOMString|ArrayBuffer|Blob
   * @return void
   */
  send (data) { this.ws.send(data) }

  /**
   * An event listener to be called when the WebSocket connection's readyState changes to CLOSED. The listener receives a CloseEvent named "close".
   * @param listener EventListener
   */
  set onclose (listener) { this.listeners.onclose = listener }

  get onclose () { return this.listeners.onclose }

  /**
   * An event listener to be called when an error occurs. This is a simple event named "error".
   * @param listener EventListener
   */
  set onerror (listener) { this.listeners.onerror = listener }

  get onerror () { return this.listeners.onerror }

  /**
   * An event listener to be called when a message is received from the server. The listener receives a MessageEvent named "message".
   * @param listener EventListener
   */
  set onmessage (listener) { this.listeners.onmessage = listener }

  get onmessage () { return this.listeners.onmessage }

  /**
   * An event listener to be called when the WebSocket connection's readyState changes to OPEN; this indicates that the connection is ready to send and receive data. The event is a simple one with the name "open".
   * @param listener EventListener
   */
  set onopen (listener) { this.listeners.onopen = listener }

  get onopen () { return this.listeners.onopen }

  /**
   * @param listener EventListener
   */
  set onreconnect (listener) { this.listeners.onreconnect = listener }

  get onreconnect () { return this.listeners.onreconnect }

  /**
   * Reset the backoff function back to initial state
   */
  reset () {
    console.log('websocket reset')
    this.backoff.reset()
  }

  /** Reconnect the websocket
   *
   */
  reconnect () {
    console.log('websocket reconnect')
    this.onBackoffReady()
  }
}

/**
 * The connection is not yet open.
 */
WebSocketClient.CONNECTING = WebSocket.CONNECTING

/**
 * The connection is open and ready to communicate.
 */
WebSocketClient.OPEN = WebSocket.OPEN

/**
 * The connection is in the process of closing.
 */
WebSocketClient.CLOSING = WebSocket.CLOSING

/**
 * The connection is closed or couldn't be opened.
 */
WebSocketClient.CLOSED = WebSocket.CLOSED
