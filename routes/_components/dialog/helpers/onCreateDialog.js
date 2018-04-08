import { on } from '../../../_utils/eventBus'

function onDestroy (id) {
  if (this.get('id') !== id) {
    return
  }
  this.destroy()
}

export function oncreate () {
  on('destroyDialog', this, onDestroy)
}
