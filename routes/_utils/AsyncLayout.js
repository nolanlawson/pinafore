// Use intersection observer to calculate rects asynchronously
import { getRectFromEntry } from './getRectFromEntry'

class AsyncLayout {
  constructor(generateKeyFromNode) {
    this._onIntersectionCallbacks = {}

    this._intersectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        let key = generateKeyFromNode(entry.target)
        this._onIntersectionCallbacks[key](entry)
      })
    })
  }

  observe(key, node, callback) {
    if (this._intersectionObserver) {
      this._onIntersectionCallbacks[key] = (entry) => {
        callback(getRectFromEntry(entry))
        this.unobserve(key, node)
      }
      this._intersectionObserver.observe(node)
    }
  }

  unobserve(key, node) {
    if (key in this._onIntersectionCallbacks) {
      return
    }
    if (this._intersectionObserver) {
      this._intersectionObserver.unobserve(node)
    }
    delete this._onIntersectionCallbacks[key]
  }

  disconnect() {
    if (this._intersectionObserver) {
      this._intersectionObserver.disconnect()
      this._intersectionObserver = null
    }
  }
}

export { AsyncLayout }