import TextConfirmationDialog from '../components/TextConfirmationDialog.html'
import { showDialog } from '../lifecycle/showDialog'

export default function showTextConfirmationDialog (options) {
  return showDialog(TextConfirmationDialog, Object.assign({
    label: 'Confirmation dialog'
  }, options))
}
