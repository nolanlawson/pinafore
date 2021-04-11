import { registerResizeListener, unregisterResizeListener } from './resize'

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
    destroy () {
      node.removeEventListener('mouseenter', onMouseEnter)
      node.removeEventListener('mouseleave', onMouseLeave)
    }
  }
}

export function selectionChange (node, callback) {
  const events = ['keyup', 'click', 'focus', 'blur']
  const listener = () => {
    callback(node.selectionStart)
  }
  for (const event of events) {
    node.addEventListener(event, listener)
  }
  return {
    destroy () {
      for (const event of events) {
        node.removeEventListener(event, listener)
      }
    }
  }
}

export function resize (node, callback) {
  registerResizeListener(callback)

  return {
    destroy () {
      unregisterResizeListener(callback)
    }
  }
}

export function documentKeydown (node, callback) {
  document.addEventListener('keydown', callback)
  return {
    destroy () {
      document.removeEventListener('keydown', callback)
    }
  }
}
