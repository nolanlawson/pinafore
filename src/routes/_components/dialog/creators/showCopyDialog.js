import CopyDialog from '../components/CopyDialog.html'
import { showDialog } from './showDialog.js'

export default function showCopyDialog (text) {
  return showDialog(CopyDialog, {
    label: 'intl.copyLink',
    title: 'intl.copyLink',
    text
  })
}
