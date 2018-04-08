import { emit } from '../../../_utils/eventBus'

export function close () {
  let id = this.get('id')
  emit('closeDialog', id)
}
