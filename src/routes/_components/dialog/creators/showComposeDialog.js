import ComposeDialog from '../components/ComposeDialog.html'
import { showDialog } from '../lifecycle/showDialog'

export default function showComposeDialog () {
  return showDialog(ComposeDialog, { label: 'Compose dialog' })
}
