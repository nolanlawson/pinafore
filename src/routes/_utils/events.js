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

export function focusWithCapture (node, callback) {
  node.addEventListener('focus', callback, true)
  return {
    destroy () {
      node.removeEventListener('focus', callback, true)
    }
  }
}

export function blurWithCapture (node, callback) {
  node.addEventListener('blur', callback, true)
  return {
    destroy () {
      node.removeEventListener('blur', callback, true)
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

// in some cases we apply focus styles to parent rather
// than the node itself because it shows up better
export function applyFocusStylesToParent (node) {
  function onFocus () {
    node.parentElement.classList.toggle('focus', true)
  }

  function onBlur () {
    node.parentElement.classList.toggle('focus', false)
  }

  node.addEventListener('focus', onFocus)
  node.addEventListener('blur', onBlur)

  return {
    destroy () {
      node.removeEventListener('focus', onFocus)
      node.removeEventListener('blur', onBlur)
    }
  }
}
