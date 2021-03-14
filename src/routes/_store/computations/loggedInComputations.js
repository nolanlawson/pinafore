// like loggedInObservers.js, these can be lazy-loaded once the user is actually logged in
import { timelineComputations } from './timelineComputations'
import { autosuggestComputations } from './autosuggestComputations'
import { store } from '../store'
import { wordFilterComputations } from './wordFilterComputations'
import { badgeComputations } from './badgeComputations'
import { timelineFilterComputations } from './timelineFilterComputations'
import { mark, stop } from '../../_utils/marks'

export function loggedInComputations () {
  mark('loggedInComputations')
  wordFilterComputations(store)
  timelineComputations(store)
  timelineFilterComputations(store)
  badgeComputations(store)
  autosuggestComputations(store)
  stop('loggedInComputations')
}
