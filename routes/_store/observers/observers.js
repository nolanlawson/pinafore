import { instanceObservers } from './instanceObservers'
import { timelineObservers } from './timelineObservers'
import { notificationObservers } from './notificationObservers'

export function observers (store) {
  instanceObservers(store)
  timelineObservers(store)
  notificationObservers(store)
}
