import { emit } from '../../../_utils/eventBus'

export function show () {
  const { id } = this.get()
  emit('showDialog', id)
}
