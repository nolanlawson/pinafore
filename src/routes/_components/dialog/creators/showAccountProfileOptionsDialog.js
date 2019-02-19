import AccountProfileOptionsDialog from '../components/AccountProfileOptionsDialog.html'
import { showDialog } from './showDialog'

export default function showAccountProfileOptionsDialog (account, relationship, verifyCredentials) {
  return showDialog(AccountProfileOptionsDialog, {
    label: 'Profile options dialog',
    title: '',
    account: account,
    relationship: relationship,
    verifyCredentials: verifyCredentials
  })
}
