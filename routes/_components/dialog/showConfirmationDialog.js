import ConfirmationDialog from './ConfirmationDialog.html'

export function showConfirmationDialog(options) {
  let dialog = new ConfirmationDialog({
    target: document.getElementById('modal-dialog'),
    data: Object.assign({
      label: 'Confirmation dialog'
    }, options)
  })
  dialog.show()
}