// like loggedInObservers.js, these can be lazy-loaded once the user is actually logged in
import { timelineComputations } from './timelineComputations'
import { autosuggestComputations } from './autosuggestComputations'

import { store } from '../store'

export function loggedInComputations () {
  timelineComputations(store)
  autosuggestComputations(store)
}
