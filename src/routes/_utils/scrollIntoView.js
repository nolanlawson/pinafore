import {
  getScrollContainer,
  getOffsetHeight
} from './scrollContainer'
import { smoothScroll } from './smoothScroll'

let mainNavElement
function getTopOverlay () {
  if (!mainNavElement) {
    mainNavElement = document.getElementById('main-nav')
  }
  return mainNavElement.clientHeight
}

export function isVisible (element) {
  if (!element) {
    return false
  }
  const rect = element.getBoundingClientRect()
  const offsetHeight = getOffsetHeight()
  const topOverlay = getTopOverlay()
  return rect.top < offsetHeight && rect.bottom >= topOverlay
}

export function firstVisibleElementIndex (elements) {
  const offsetHeight = getOffsetHeight()
  const topOverlay = getTopOverlay()
  let first = -1
  let firstComplete = -1
  const len = elements.length
  let i = -1
  while (++i < len) {
    const element = elements[i]
    if (!element) {
      continue
    }
    const rect = element.getBoundingClientRect()
    if (rect.top < offsetHeight && rect.bottom >= topOverlay) {
      first = i
      firstComplete = (rect.top < topOverlay && i < (len - 1)) ? i + 1 : i
      break
    }
  }
  return { first, firstComplete }
}

export function scrollIntoViewIfNeeded (element) {
  const rect = element.getBoundingClientRect()
  const topOverlay = getTopOverlay()
  const offsetHeight = getOffsetHeight()
  let scrollY = 0
  if (rect.top < topOverlay) {
    scrollY = topOverlay
  } else if (rect.bottom > offsetHeight) {
    const height = rect.bottom - rect.top
    if ((offsetHeight - topOverlay) > height) {
      scrollY = offsetHeight - height
    } else {
      // if element height is too great to fit,
      // prefer showing the top of the element
      scrollY = topOverlay
    }
  } else {
    return // not needed
  }
  const scrollContainer = getScrollContainer()
  const scrollTop = scrollContainer.scrollTop
  smoothScroll(scrollContainer, scrollTop + rect.top - scrollY, /* horizontal */ false, /* preferFast */ false)
}
