import { instanceComputations } from './instanceComputations'
import { timelineComputations } from './timelineComputations'

export function computations (store) {
  instanceComputations(store)
  timelineComputations(store)
}
