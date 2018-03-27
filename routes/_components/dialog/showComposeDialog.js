import ComposeDialog from './ComposeDialog.html'

export function showComposeDialog () {
  let dialog = new ComposeDialog({
    target: document.getElementById('modal-dialog'),
    data: {
      label: 'Compose dialog'
    }
  })
  dialog.show()
}
