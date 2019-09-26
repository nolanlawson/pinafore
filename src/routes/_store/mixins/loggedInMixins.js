import { timelineMixins } from './timelineMixins'
import { statusMixins } from './statusMixins'
import { autosuggestMixins } from './autosuggestMixins'
import { composeMixins } from './composeMixins'
import { PinaforeStore as Store } from '../store'

export function loggedInMixins () {
  composeMixins(Store)
  timelineMixins(Store)
  statusMixins(Store)
  autosuggestMixins(Store)
}
