import { doubleRAF } from './doubleRAF'

const RETRIES = 5
const TIMEOUT = 40
const BACKOFF_FACTOR = 2

// Try several times to focus an element. This is useful for cases where the element may
// be lazily rendered, but we still want to make a best effort to focus it.
export function tryToFocusElement (getElement) {
  let count = 0
  let timeout = TIMEOUT

  function retryFocus () {
    let element = getElement()
    if (element) {
      try {
        element.focus({ preventScroll: true })
        return
      } catch (e) {
        console.error(e)
      }
    }
    if (++count <= RETRIES) {
      setTimeout(() => requestAnimationFrame(retryFocus), timeout)
      timeout *= BACKOFF_FACTOR
    }
  }
  // double rAF is to work around issues with restoring focus in the timeline and dialog
  doubleRAF(retryFocus)
}
