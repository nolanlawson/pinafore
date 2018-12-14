import ComposeDialog from '../components/ComposeDialog.html'
import { createDialogElement } from '../helpers/createDialogElement.js'
import { createDialogId } from '../helpers/createDialogId.js'

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
