// Delegate certain events to the global document for perf purposes.

import { mark, stop } from './marks'

const callbacks = {}

if (process.browser && process.env.NODE_ENV !== 'production') {
  window.delegateCallbacks = callbacks
}

function onEvent (e) {
  let { type, keyCode, target } = e
  if (!(type === 'click' || (type === 'keydown' && keyCode === 13))) {
    // we're not interested in any non-click or non-Enter events
    return
  }
  if (type === 'click') {
    let selection = window.getSelection()
    let selectionStr = selection && selection.toString()
    if (selectionStr && selectionStr.length && target.contains(selection.anchorNode)) {
      return // ignore if the user is selecting text inside the clickable area
    }
  }
  mark('delegate onEvent')
  let key
  let element = target
  while (element) {
    if ((key = element.getAttribute('delegate-key'))) {
      break
    }
    element = element.parentElement
  }
  if (key && callbacks[key]) {
    callbacks[key](e)
  }
  stop('delegate onEvent')
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
