import { timelineMixins } from './timelineMixins'
import { instanceMixins } from './instanceMixins'
import { statusMixins } from './statusMixins'
import { autosuggestMixins } from './autosuggestMixins'

export function mixins (Store) {
  instanceMixins(Store)
  timelineMixins(Store)
  statusMixins(Store)
  autosuggestMixins(Store)
}
