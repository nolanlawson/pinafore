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
  let attr = `delegate-${type}-key`
  let key
  let element = target
  while (element) {
    if ((key = element.getAttribute(attr))) {
      break
    }
    element = element.parentElement
  }
  if (key && callbacks[type] && callbacks[type][key]) {
    callbacks[type][key](e)
  }
  stop('delegate onEvent')
}

export function registerDelegate (type, key, callback) {
  mark('delegate registerDelegate')
  callbacks[type] = callbacks[type] || {}
  callbacks[type][key] = callback
  stop('delegate registerDelegate')
}

export function unregisterDelegate (type, key) {
  mark('delegate unregisterDelegate')
  callbacks[type] = callbacks[type] || {}
  delete callbacks[type][key]
  stop('delegate unregisterDelegate')
}

if (process.browser) {
  document.addEventListener('click', onEvent)
  document.addEventListener('keydown', onEvent)
}
