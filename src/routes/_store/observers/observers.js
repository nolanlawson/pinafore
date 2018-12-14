import { instanceObservers } from './instanceObservers.js'
import { timelineObservers } from './timelineObservers.js'
import { notificationObservers } from './notificationObservers.js'
import { onlineObservers } from './onlineObservers.js'
import { navObservers } from './navObservers.js'
import { autosuggestObservers } from './autosuggestObservers.js'
import { pageVisibilityObservers } from './pageVisibilityObservers.js'
import { resizeObservers } from './resizeObservers.js'
import { notificationPermissionObservers } from './notificationPermissionObservers.js'
import { customScrollbarObservers } from './customScrollbarObservers.js'

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
