import { emit } from '../../../_utils/eventBus.js'

export function show () {
  let { id } = this.get()
  emit('showDialog', id)
}
