import {
  getScrollContainer,
  getOffsetHeight } from './scrollContainer'
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
  let rect = element.getBoundingClientRect()
  let offsetHeight = getOffsetHeight()
  let topOverlay = getTopOverlay()
  return rect.top < offsetHeight && rect.bottom >= topOverlay
}

export function firstVisibleElementIndex (items, itemElementFunction) {
  let offsetHeight = getOffsetHeight()
  let topOverlay = getTopOverlay()
  let first = -1
  let firstComplete = -1
  let len = items.length
  let i = -1
  while (++i < len) {
    let element = itemElementFunction(items[i])
    if (!element) {
      continue
    }
    let rect = element.getBoundingClientRect()
    if (rect.top < offsetHeight && rect.bottom >= topOverlay) {
      first = i
      firstComplete = (
        rect.top < topOverlay && i < (len - 1)) ? i + 1 : i
      break
    }
  }
  return { first, firstComplete }
}

export function scrollIntoViewIfNeeded (element) {
  let rect = element.getBoundingClientRect()
  let topOverlay = getTopOverlay()
  let offsetHeight = getOffsetHeight()
  let scrollY = 0
  if (rect.top < topOverlay) {
    scrollY = topOverlay
  } else if (rect.bottom > offsetHeight) {
    let height = rect.bottom - rect.top
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
  let scrollContainer = getScrollContainer()
  let scrollTop = scrollContainer.scrollTop
  smoothScroll(scrollContainer, scrollTop + rect.top - scrollY)
}
