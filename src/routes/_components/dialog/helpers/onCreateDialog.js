import { on } from '../../../_utils/eventBus'

function onDestroy (thisId) {
  let { id } = this.get()
  if (id !== thisId) {
    return
  }
  this.destroy()
}

export function oncreate () {
  on('destroyDialog', this, onDestroy)
}
