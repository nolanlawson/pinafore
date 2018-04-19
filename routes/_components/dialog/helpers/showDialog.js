import { emit } from '../../../_utils/eventBus'

export function show () {
  let { id } = this.get()
  emit('showDialog', id)
}
