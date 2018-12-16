import { onlineObservers } from './onlineObservers'
import { navObservers } from './navObservers'
import { pageVisibilityObservers } from './pageVisibilityObservers'
import { resizeObservers } from './resizeObservers'

export function observers (store) {
  onlineObservers(store)
  navObservers(store)
  pageVisibilityObservers(store)
  resizeObservers(store)
}
