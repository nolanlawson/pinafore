import { instanceComputations } from './instanceComputations'
import { timelineComputations } from './timelineComputations'
import { navComputations } from './navComputations'

export function computations (store) {
  instanceComputations(store)
  timelineComputations(store)
  navComputations(store)
}
