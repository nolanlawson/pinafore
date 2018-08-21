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
  let cbs = key && callbacks[key]
  if (cbs) {
    for (let i = 0; i < cbs.length; i++) {
      cbs[i](e)
    }
  }
  stop('delegate onEvent')
}

export function addClickDelegate (key, callback) {
  callbacks[key] = callbacks[key] || []
  callbacks[key].push(callback)
}

export function removeClickDelegate (key, callback) {
  if (process.env.NODE_ENV !== 'production') {
    if (!callback) {
      throw new Error('callback must be non-null')
    }
  }
  let cbs = callbacks[key]
  if (cbs) {
    let idx = cbs.indexOf(callback)
    if (idx !== -1) {
      cbs.splice(idx, 1)
    }
  }
  if (!cbs.length) {
    delete callbacks[key]
  }
}

if (process.browser) {
  document.addEventListener('click', onEvent)
  document.addEventListener('keydown', onEvent)
}
