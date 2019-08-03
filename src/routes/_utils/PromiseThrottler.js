// Utility for throttling in the Lodash style (assuming leading: true and trailing: true) but
// creates a promise.
export class PromiseThrottler {
  constructor (timeout) {
    this._timeout = timeout
    this._promise = Promise.resolve()
  }

  next () {
    const res = this._promise
    // update afterwards, so we get a "leading" XHR
    this._promise = this._promise.then(() => new Promise(resolve => setTimeout(resolve, this._timeout)))
    return res
  }
}
