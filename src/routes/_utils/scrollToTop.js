import { getScrollContainer } from './scrollContainer'
import { smoothScroll } from './smoothScroll'

export function scrollToTop (smooth) {
  const scroller = getScrollContainer()
  const { scrollTop } = scroller
  if (scrollTop === 0) {
    return false
  }
  if (smooth) {
    smoothScroll(scroller, 0, /* horizontal */ false, /* preferFast */ true)
  } else {
    scroller.scrollTop = 0
  }
  return true
}
