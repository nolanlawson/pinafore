import { instanceComputations } from './instanceComputations'
import { navComputations } from './navComputations'

export function computations (store) {
  instanceComputations(store)
  navComputations(store)
}
