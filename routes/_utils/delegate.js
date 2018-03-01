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

export function registerClickDelegate (key, callback) {
  callbacks[key] = callback
}

export function unregisterClickDelegate (key) {
  delete callbacks[key]
}

if (process.browser) {
  document.addEventListener('click', onEvent)
  document.addEventListener('keydown', onEvent)
}
