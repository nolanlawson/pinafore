import { instanceComputations } from './instanceComputations'
import { timelineComputations } from './timelineComputations'
import { statusComputations } from './statusComputations'

export function computations (store) {
  instanceComputations(store)
  timelineComputations(store)
  statusComputations(store)
}
