import StatusOptionsDialog from './StatusOptionsDialog.html'
import { createDialogElement } from './createDialogElement'

export function showStatusOptionsDialog (statusId) {
  let dialog = new StatusOptionsDialog({
    target: createDialogElement(),
    data: {
      label: 'Status options dialog',
      title: '',
      statusId: statusId
    }
  })
  dialog.show()
}
