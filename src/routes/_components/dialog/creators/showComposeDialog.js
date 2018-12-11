import ComposeDialog from '../components/ComposeDialog.html'
import { createDialogElement } from '../helpers/createDialogElement'
import { createDialogId } from '../helpers/createDialogId'

export default function showComposeDialog () {
  let dialog = new ComposeDialog({
    target: createDialogElement(),
    data: {
      id: createDialogId(),
      label: 'Compose dialog'
    }
  })
  dialog.show()
}
