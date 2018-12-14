import ConfirmationDialog from '../components/ConfirmationDialog.html'
import { createDialogElement } from '../helpers/createDialogElement.js'
import { createDialogId } from '../helpers/createDialogId.js'

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
