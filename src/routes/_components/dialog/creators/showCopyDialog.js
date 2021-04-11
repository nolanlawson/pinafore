import CopyDialog from '../components/CopyDialog.html'
import { showDialog } from './showDialog'

export default function showCopyDialog (text) {
  return showDialog(CopyDialog, {
    label: 'intl.copyLink',
    title: 'intl.copyLink',
    text
  })
}
