import { emit } from '../../../_utils/eventBus'

export function close () {
  let { id } = this.get()
  emit('closeDialog', id)
}
