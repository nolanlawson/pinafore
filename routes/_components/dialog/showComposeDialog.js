import ComposeDialog from './ComposeDialog.html'
import { createDialogElement } from './createDialogElement'

export function showComposeDialog () {
  let dialog = new ComposeDialog({
    target: createDialogElement(),
    data: {
      label: 'Compose dialog'
    }
  })
  dialog.show()
}
