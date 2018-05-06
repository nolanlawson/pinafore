import { instanceComputations } from './instanceComputations'
import { timelineComputations } from './timelineComputations'
import { navComputations } from './navComputations'
import { autosuggestComputations } from './autosuggestComputations'

export function computations (store) {
  instanceComputations(store)
  timelineComputations(store)
  navComputations(store)
  autosuggestComputations(store)
}
