import { emit } from '../../../_utils/eventBus.js'

export function close () {
  const { id } = this.get()
  emit('closeDialog', id)
}
