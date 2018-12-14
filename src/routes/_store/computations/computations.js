import { instanceComputations } from './instanceComputations.js'
import { timelineComputations } from './timelineComputations.js'
import { navComputations } from './navComputations.js'
import { autosuggestComputations } from './autosuggestComputations.js'

export function computations (store) {
  instanceComputations(store)
  timelineComputations(store)
  navComputations(store)
  autosuggestComputations(store)
}
