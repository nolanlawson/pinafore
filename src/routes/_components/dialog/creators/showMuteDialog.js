import MuteDialog from '../components/MuteDialog.html'
import { createDialogElement } from '../helpers/createDialogElement'
import { createDialogId } from '../helpers/createDialogId'

export default function showMuteDialog (account) {
  let dialog = new MuteDialog({
    target: createDialogElement(),
    data: {
      id: createDialogId(),
      label: 'Mute dialog',
      account
    }
  })
  dialog.show()
  return dialog
}
