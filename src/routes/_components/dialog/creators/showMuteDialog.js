import MuteDialog from '../components/MuteDialog.html'
import { showDialog } from '../lifecycle/showDialog'

export default function showMuteDialog (account) {
  return showDialog(MuteDialog, {
    label: 'Mute dialog',
    account
  })
}
