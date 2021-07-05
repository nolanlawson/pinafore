import { emit } from '../../../_utils/eventBus.js'

export function show () {
  const { id } = this.get()
  emit('showDialog', id)
}
