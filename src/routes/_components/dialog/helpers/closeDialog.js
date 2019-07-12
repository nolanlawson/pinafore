import { emit } from '../../../_utils/eventBus'

export function close () {
  const { id } = this.get()
  emit('closeDialog', id)
}
