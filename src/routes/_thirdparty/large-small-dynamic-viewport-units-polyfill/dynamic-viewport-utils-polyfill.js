// via https://github.com/joppuyo/large-small-dynamic-viewport-units-polyfill/blob/93782ffff5d76f46b71591b859aac44f3cd591b2/src/index.js
// with some stuff removed that we don't need
import { throttleTimer } from '../../_utils/throttleTimer.js'

// Don't execute this resize listener more than the browser can paint
const rafAlignedResize = process.browser && throttleTimer(requestAnimationFrame)

function setVh () {
  const dvh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--1dvh', (dvh + 'px'))
}

if (process.browser) {
  // We run the calculation as soon as possible (eg. the script is in document head)
  setVh()

  // We run the calculation again when DOM has loaded
  document.addEventListener('DOMContentLoaded', setVh)

  // We run the calculation when window is resized
  window.addEventListener('resize', () => {
    rafAlignedResize(setVh)
  })
}
