import { instanceComputations } from './instanceComputations.js'
import { navComputations } from './navComputations.js'

export function computations (store) {
  instanceComputations(store)
  navComputations(store)
}
