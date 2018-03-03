import { timelineMixins } from './timelineMixins'
import { instanceMixins } from './instanceMixins'

export function mixins (Store) {
  instanceMixins(Store)
  timelineMixins(Store)
}
