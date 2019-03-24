import CopyDialog from '../components/CopyDialog.html'
import { showDialog } from '../lifecycle/showDialog'

export default function showCopyDialog (text) {
  return showDialog(CopyDialog, {
    label: 'Copy dialog',
    title: 'Copy link',
    text
  })
}
