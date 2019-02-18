import TextConfirmationDialog from '../components/TextConfirmationDialog.html'
import { createDialogElement } from '../helpers/createDialogElement'
import { createDialogId } from '../helpers/createDialogId'

export default function showTextConfirmationDialog (options) {
  let dialog = new TextConfirmationDialog({
    target: createDialogElement(),
    data: Object.assign({
      id: createDialogId(),
      label: 'Confirmation dialog'
    }, options)
  })
  dialog.show()
  return dialog
}
