import ConfirmationDialog from '../components/ConfirmationDialog.html'
import { createDialogElement } from '../helpers/createDialogElement'
import { createDialogId } from '../helpers/createDialogId'

export default function showConfirmationDialog (options) {
  let dialog = new ConfirmationDialog({
    target: createDialogElement(),
    data: Object.assign({
      id: createDialogId(),
      label: 'Confirmation dialog'
    }, options)
  })
  dialog.show()
}
