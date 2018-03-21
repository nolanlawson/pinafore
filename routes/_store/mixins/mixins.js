import { timelineMixins } from './timelineMixins'
import { instanceMixins } from './instanceMixins'
import { statusMixins } from './statusMixins'

export function mixins (Store) {
  instanceMixins(Store)
  timelineMixins(Store)
  statusMixins(Store)
}
