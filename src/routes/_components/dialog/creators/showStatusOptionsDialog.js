import StatusOptionsDialog from '../components/StatusOptionsDialog.html'
import { showDialog } from './showDialog'

export default function showStatusOptionsDialog (status) {
  return showDialog(StatusOptionsDialog, {
    label: 'intl.statusOptions',
    title: '',
    status: status
  })
}
