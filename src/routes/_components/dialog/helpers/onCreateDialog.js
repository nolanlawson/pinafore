import { on } from '../../../_utils/eventBus.js'

function onDestroy (thisId) {
  const { id } = this.get()
  if (id !== thisId) {
    return
  }
  this.destroy()
}

export function oncreate () {
  on('destroyDialog', this, onDestroy)
}
