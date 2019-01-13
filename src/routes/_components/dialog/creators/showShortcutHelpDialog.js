import ShortcutHelpDialog from '../components/ShortcutHelpDialog.html'
import { createDialogElement } from '../helpers/createDialogElement'
import { createDialogId } from '../helpers/createDialogId'

export default function showShortcutHelpDialog (options) {
  let dialog = new ShortcutHelpDialog({
    target: createDialogElement(),
    data: Object.assign({
      id: createDialogId(),
      label: 'shortcut help dialog'
    }, options)
  })
  dialog.show()
}
