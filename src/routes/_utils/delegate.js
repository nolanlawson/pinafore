// Delegate certain events to the global document for perf purposes.

const callbacks = {}

if (process.browser && process.env.NODE_ENV !== 'production') {
  window.delegateCallbacks = callbacks
}

function onEvent (e) {
  const { type, keyCode, target } = e
  if (!(type === 'click' || (type === 'keydown' && keyCode === 13))) {
    // we're not interested in any non-click or non-Enter events
    return
  }
  let key
  let element = target
  while (element) {
    if ((key = element.getAttribute('id'))) {
      break
    }
    element = element.parentElement
  }
  if (key && callbacks[key]) {
    if (type === 'click') {
      const selection = window.getSelection()
      const selectionStr = selection && selection.toString()
      if (selectionStr && selectionStr.length && target.contains(selection.anchorNode)) {
        return // ignore if the user is selecting text inside the clickable area
      }
    }
    const res = callbacks[key](e) // callback returns true to indicate it has handled the action
    if (process.env.NODE_ENV !== 'production' && typeof res !== 'boolean') {
      console.warn(`Callback returned a non-boolean response: "${key}". This should never happen.`)
    }
    if (res) {
      e.preventDefault()
      e.stopPropagation()
    }
  }
}

export function registerClickDelegates (component, delegates) {
  Object.assign(callbacks, delegates)

  component.on('destroy', () => {
    Object.keys(delegates).forEach(key => {
      delete callbacks[key]
    })
  })
}

export function registerClickDelegate (component, key, callback) {
  registerClickDelegates(component, { [key]: callback })
}

if (process.browser) {
  document.addEventListener('click', onEvent)
  document.addEventListener('keydown', onEvent)
}
