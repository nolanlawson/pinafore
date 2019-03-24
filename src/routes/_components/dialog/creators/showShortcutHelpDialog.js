import ShortcutHelpDialog from '../components/ShortcutHelpDialog.html'
import { showDialog } from '../lifecycle/showDialog'

export default function showShortcutHelpDialog (options) {
  return showDialog(ShortcutHelpDialog, Object.assign({
    label: 'shortcut help dialog'
  }, options))
}
