import { onlineObservers } from './onlineObservers'
import { nowObservers } from './nowObservers'
import { navObservers } from './navObservers'
import { pageVisibilityObservers } from './pageVisibilityObservers'
import { resizeObservers } from './resizeObservers'
import { setupLoggedInObservers } from './setupLoggedInObservers'
import { logOutObservers } from './logOutObservers'
import { touchObservers } from './touchObservers'
import { grayscaleObservers } from './grayscaleObservers'
import { focusRingObservers } from './focusRingObservers'
import { leftRightFocusObservers } from './leftRightFocusObservers'

export function observers (store) {
  onlineObservers(store)
  nowObservers(store)
  navObservers(store)
  pageVisibilityObservers(store)
  resizeObservers(store)
  touchObservers(store)
  logOutObservers(store)
  focusRingObservers(store)
  grayscaleObservers(store)
  leftRightFocusObservers(store)
  setupLoggedInObservers(store)
}
