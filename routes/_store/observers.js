import { instanceObservers } from './instanceObservers'
import { timelineObservers } from './timelineObservers'

export function observers (store) {
  instanceObservers(store)
  timelineObservers(store)
}
