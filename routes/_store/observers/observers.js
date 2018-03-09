import { instanceObservers } from './instanceObservers'
import { timelineObservers } from './timelineObservers'
import { notificationObservers } from './notificationObservers'
import { onlineObservers } from './onlineObservers'

export function observers (store) {
  instanceObservers(store)
  timelineObservers(store)
  notificationObservers(store)
  onlineObservers(store)
}
