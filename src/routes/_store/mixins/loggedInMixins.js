import { timelineMixins } from './timelineMixins.js'
import { statusMixins } from './statusMixins.js'
import { autosuggestMixins } from './autosuggestMixins.js'
import { composeMixins } from './composeMixins.js'
import { SemaphoreStore as Store } from '../store.js'

export function loggedInMixins () {
  composeMixins(Store)
  timelineMixins(Store)
  statusMixins(Store)
  autosuggestMixins(Store)
}
