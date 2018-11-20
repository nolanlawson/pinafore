export function getScrollContainer () {
  return document.scrollingElement
}

export function addScrollListener (listener) {
  document.addEventListener('scroll', listener)
}

export function removeScrollListener (listener) {
  document.removeEventListener('scroll', listener)
}

export function getOffsetHeight () {
  // in a subscroller, this would be element.offsetHeight, but here
  // document.scrollingElement.offsetHeight is too short for some reason.
  // This one is exact, such that scrollHeight - scrollTop - offsetHeight === 0
  // when you are scrolled to the bottom.
  return window.innerHeight
}
