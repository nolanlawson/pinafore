// like loggedInObservers.js, these can be lazy-loaded once the user is actually logged in
import { timelineComputations } from './timelineComputations'
import { autosuggestComputations } from './autosuggestComputations'

import { store } from '../store'
import { wordFilterComputations } from './wordFilterComputations'

export function loggedInComputations () {
  wordFilterComputations(store)
  timelineComputations(store)
  autosuggestComputations(store)
}
