import * as sapper from '../__sapper__/client.js'
import { loadPolyfills } from './routes/_utils/loadPolyfills'
import './routes/_utils/serviceWorkerClient'
import './routes/_utils/historyEvents'
import './routes/_utils/loadingMask'
import './routes/_utils/forceOnline'

loadPolyfills().then(() => {
  console.log('init()')
  sapper.start({ target: document.querySelector('#sapper') })
})

console.log('process.env.NODE_ENV', process.env.NODE_ENV)

console.log('hello kaios')

function focusPrevious () {
  console.log('focusPrevious')
  const focusable = getFocusableElements()
  const index = focusable.indexOf(document.activeElement)
  if (index === -1) {
    focusable[focusable.length - 1].focus()
  } else {
    (focusable[index - 1] || focusable[focusable.length - 1]).focus()
  }
}

function focusNext () {
  console.log('focusNext')
  const focusable = getFocusableElements()
  const index = focusable.indexOf(document.activeElement)
  if (index === -1) {
    focusable[0].focus()
  } else {
    (focusable[index + 1] || focusable[0]).focus()
  }
}

function getFocusableElements () {
  const query = 'a:not([disabled]), button:not([disabled]), ' +
    'input[type=text]:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])'
  return Array.from(document.querySelectorAll(query)).filter(element => {
    // check for visibility while always include the current activeElement
    return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement
  })
}

window.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') {
    focusNext()
  } else if (e.key === 'ArrowLeft') {
    focusPrevious()
  }
})

if (module.hot) {
  module.hot.accept()
}
