import ConfirmationDialog from './ConfirmationDialog.html'
import { createDialogElement } from './createDialogElement'

export function showConfirmationDialog (options) {
  let dialog = new ConfirmationDialog({
    target: createDialogElement(),
    data: Object.assign({
      label: 'Confirmation dialog'
    }, options)
  })
  dialog.show()
}
