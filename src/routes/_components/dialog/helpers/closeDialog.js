import { emit } from '../../../_utils/eventBus.js'

export function close () {
  let { id } = this.get()
  emit('closeDialog', id)
}
