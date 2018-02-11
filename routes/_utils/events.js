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

export function mouseover (node, callback) {
  function onMouseEnter () {
    callback(true) // eslint-disable-line
  }
  function onMouseLeave () {
    callback(false) // eslint-disable-line
  }
  node.addEventListener('mouseenter', onMouseEnter)
  node.addEventListener('mouseleave', onMouseLeave)
  return {
    teardown () {
      node.removeEventListener('mouseenter', onMouseEnter)
      node.removeEventListener('mouseleave', onMouseLeave)
    }
  }
}

export function focusWithCapture (node, callback) {
  node.addEventListener('focus', callback, true)
  return {
    teardown () {
      node.removeEventListener('focus', callback, true)
    }
  }
}

export function blurWithCapture (node, callback) {
  node.addEventListener('blur', callback, true)
  return {
    teardown () {
      node.removeEventListener('blur', callback, true)
    }
  }
}
