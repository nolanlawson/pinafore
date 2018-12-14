import StatusOptionsDialog from '../components/StatusOptionsDialog.html'
import { createDialogElement } from '../helpers/createDialogElement.js'
import { createDialogId } from '../helpers/createDialogId.js'

export default function showStatusOptionsDialog (status) {
  let dialog = new StatusOptionsDialog({
    target: createDialogElement(),
    data: {
      id: createDialogId(),
      label: 'Status options dialog',
      title: '',
      status: status
    }
  })
  dialog.show()
}
