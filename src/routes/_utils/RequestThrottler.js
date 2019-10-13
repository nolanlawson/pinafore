// Throttle network requests to be a good citizen and not issue an HTTP request on every keystroke
import { PromiseThrottler } from './PromiseThrottler'

const promiseThrottler = new PromiseThrottler(200) // Mastodon FE also uses 200ms

export class RequestThrottler {
  constructor (fetcher) {
    this._canceled = false
    this._controller = typeof AbortController === 'function' && new AbortController()
    this._fetcher = fetcher
  }

  async request () {
    if (this._canceled) {
      throw new Error('canceled')
    }
    await promiseThrottler.next()
    if (this._canceled) {
      throw new Error('canceled')
    }
    const signal = this._controller && this._controller.signal
    return this._fetcher(signal)
  }

  cancel () {
    this._canceled = true
    if (this._controller) {
      this._controller.abort()
      this._controller = null
    }
  }
}
