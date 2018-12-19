import { onlineObservers } from './onlineObservers'
import { navObservers } from './navObservers'
import { pageVisibilityObservers } from './pageVisibilityObservers'
import { resizeObservers } from './resizeObservers'
import { setupLoggedInObservers } from './setupLoggedInObservers'
import { logOutObservers } from './logOutObservers'
import { touchObservers } from './touchObservers'

export function observers (store) {
  onlineObservers(store)
  navObservers(store)
  pageVisibilityObservers(store)
  resizeObservers(store)
  touchObservers(store)
  logOutObservers(store)
  setupLoggedInObservers(store)
}
