// Throttle network requests to be a good citizen and not issue an HTTP request on every keystroke
import { PromiseThrottler } from './PromiseThrottler'

const promiseThrottler = new PromiseThrottler(200) // Mastodon FE also uses 200ms

export class RequestThrottler {
  constructor (fetcher, onNewResults) {
    this._canceled = false
    this._controller = typeof AbortController === 'function' && new AbortController()
    this._fetcher = fetcher
    this._onNewResults = onNewResults
  }

  async request () {
    if (this._canceled) {
      return
    }
    await promiseThrottler.next()
    if (this._canceled) {
      return
    }
    const signal = this._controller && this._controller.signal
    const results = await this._fetcher(signal)
    this._onNewResults(results)
  }

  cancel () {
    this._canceled = true
    if (this._controller) {
      this._controller.abort()
      this._controller = null
    }
  }
}
