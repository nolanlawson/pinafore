import {
  getScrollContainer,
  getOffsetHeight } from './scrollContainer'
import { smoothScroll } from './smoothScroll'

function getTopOverlay () {
  return document.getElementById('main-nav').clientHeight
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
  let len = items.length
  let i = -1
  while (++i < len) {
    let element = itemElementFunction(items[i])
    if (!element) {
      continue
    }
    let rect = element.getBoundingClientRect()
    if (rect.top < offsetHeight && rect.bottom >= topOverlay) {
      let firstComplete = i
      if (rect.top < topOverlay && i < (len - 1)) {
        firstComplete = i + 1
      }
      return { first: i, firstComplete }
    }
  }
  return -1
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
