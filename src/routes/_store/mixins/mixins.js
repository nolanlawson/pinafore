import { timelineMixins } from './timelineMixins.js'
import { instanceMixins } from './instanceMixins.js'
import { statusMixins } from './statusMixins.js'
import { autosuggestMixins } from './autosuggestMixins.js'

export function mixins (Store) {
  instanceMixins(Store)
  timelineMixins(Store)
  statusMixins(Store)
  autosuggestMixins(Store)
}
