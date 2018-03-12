import StatusOptionsDialog from './StatusOptionsDialog.html'

export function showStatusOptionsDialog (statusId) {
  let dialog = new StatusOptionsDialog({
    target: document.getElementById('modal-dialog'),
    data: {
      label: 'Status options dialog',
      title: 'Status options',
      statusId: statusId
    }
  })
  dialog.show()
}
