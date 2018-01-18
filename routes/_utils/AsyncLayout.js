// Use intersection observer to calculate rects asynchronously
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
    this._onIntersectionCallbacks[key] = (entry) => {
      callback(entry.boundingClientRect)
      this.unobserve(key, node)
    }
    this._intersectionObserver.observe(node)
  }

  unobserve(key, node) {
    if (key in this._onIntersectionCallbacks) {
      return
    }
    this._intersectionObserver.unobserve(node)
    delete this._onIntersectionCallbacks[key]
  }
}

export { AsyncLayout }