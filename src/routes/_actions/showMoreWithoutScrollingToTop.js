import { showMoreItemsForCurrentTimeline } from './timeline.js'
import { getScrollContainer } from '../_utils/scrollContainer.js'
import { tryToFocusElement } from '../_utils/tryToFocusElement.js'
import { doubleRAF } from '../_utils/doubleRAF.js'

export async function showMoreWithoutScrollingToTop () {
  // Similar to "." (showMoreAndScrollToTop), except it doesn't scroll to the top
  const id = document.activeElement && document.activeElement.id
  const { scrollHeight, scrollTop } = getScrollContainer()
  await showMoreItemsForCurrentTimeline()
  // There seems to be some kind of race condition with what the timeline is doing. This is a best
  // effort to maintain scroll position.
  await new Promise(resolve => doubleRAF(resolve))
  await new Promise(resolve => doubleRAF(resolve))
  // restore scroll position
  const { scrollHeight: newScrollHeight } = getScrollContainer()
  const newScrollTop = scrollTop + (newScrollHeight - scrollHeight)
  console.log({ scrollHeight, scrollTop, newScrollHeight, newScrollTop })
  getScrollContainer().scrollTop = newScrollTop
  if (id) {
    await tryToFocusElement(id)
  }
}
