export function getScrollContainer () {
  return document.scrollingElement
}

export function addScrollListener (listener) {
  document.addEventListener('scroll', listener)
}

export function removeScrollListener (listener) {
  document.removeEventListener('scroll', listener)
}
