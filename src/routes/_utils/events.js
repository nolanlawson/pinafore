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
  let events = ['keyup', 'click', 'focus', 'blur']
  let listener = () => {
    callback(node.selectionStart)
  }
  for (let event of events) {
    node.addEventListener(event, listener)
  }
  return {
    destroy () {
      for (let event of events) {
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
