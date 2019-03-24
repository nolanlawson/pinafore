import AccountProfileOptionsDialog from '../components/AccountProfileOptionsDialog.html'
import { showDialog } from '../lifecycle/showDialog'

export default function showAccountProfileOptionsDialog (account, relationship, verifyCredentials) {
  return showDialog(AccountProfileOptionsDialog, {
    label: 'Profile options dialog',
    title: '',
    account: account,
    relationship: relationship,
    verifyCredentials: verifyCredentials
  })
}
