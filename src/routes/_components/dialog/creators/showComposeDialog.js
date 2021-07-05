import ComposeDialog from '../components/ComposeDialog.html'
import { showDialog } from './showDialog.js'

export default function showComposeDialog () {
  return showDialog(ComposeDialog, { label: 'intl.composeStatus' })
}
