export function imgLoadError (node, callback) {
  node.addEventListener('error', callback)

  return {
    teardown () {
      node.removeEventListener('error', callback)
    }
  }
}

export function imgLoad (node, callback) {
  node.addEventListener('load', callback)

  return {
    teardown () {
      node.removeEventListener('load', callback)
    }
  }
}