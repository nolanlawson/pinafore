import { instanceObservers } from './instanceObservers'
import { timelineObservers } from './timelineObservers'
import { notificationObservers } from './notificationObservers'
import { onlineObservers } from './onlineObservers'
import { navObservers } from './navObservers'
import { autosuggestObservers } from './autosuggestObservers'
import { pageVisibilityObservers } from './pageVisibilityObservers'
import { resizeObservers } from './resizeObservers'
import { notificationPermissionObservers } from './notificationPermissionObservers'
import { customScrollbarObservers } from './customScrollbarObservers'

export function observers (store) {
  instanceObservers(store)
  timelineObservers(store)
  notificationObservers(store)
  onlineObservers(store)
  navObservers(store)
  autosuggestObservers(store)
  pageVisibilityObservers(store)
  resizeObservers(store)
  notificationPermissionObservers(store)
  customScrollbarObservers(store)
}
