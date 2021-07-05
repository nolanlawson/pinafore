import TextConfirmationDialog from '../components/TextConfirmationDialog.html'
import { showDialog } from './showDialog.js'

export default function showTextConfirmationDialog (options) {
  return showDialog(TextConfirmationDialog, Object.assign({
    label: 'intl.confirm'
  }, options))
}
