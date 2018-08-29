import { timelineMixins } from './timelineMixins'
import { instanceMixins } from './instanceMixins'
import { autosuggestMixins } from './autosuggestMixins'

export function mixins (Store) {
  instanceMixins(Store)
  timelineMixins(Store)
  autosuggestMixins(Store)
}
