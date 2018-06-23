import { instanceObservers } from './instanceObservers'
import { timelineObservers } from './timelineObservers'
import { notificationObservers } from './notificationObservers'
import { onlineObservers } from './onlineObservers'
import { navObservers } from './navObservers'
import { autosuggestObservers } from './autosuggestObservers'
import { pageVisibilityObservers } from './pageVisibilityObservers'

export function observers (store) {
  instanceObservers(store)
  timelineObservers(store)
  notificationObservers(store)
  onlineObservers(store)
  navObservers(store)
  autosuggestObservers(store)
  pageVisibilityObservers(store)
}
