import { getScrollContainer } from './scrollContainer'
import { smoothScroll } from './smoothScroll'

export function scrollToTop (smooth) {
  let scroller = getScrollContainer()
  let { scrollTop } = scroller
  if (scrollTop === 0) {
    return false
  }
  if (smooth) {
    smoothScroll(scroller, 0)
  } else {
    scroller.scrollTop = 0
  }
  return true
}
