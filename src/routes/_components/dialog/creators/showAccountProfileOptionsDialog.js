import AccountProfileOptionsDialog from '../components/AccountProfileOptionsDialog.html'
import { showDialog } from './showDialog'

export default function showAccountProfileOptionsDialog (account, relationship, verifyCredentials) {
  return showDialog(AccountProfileOptionsDialog, {
    label: 'intl.profileOptions',
    title: '',
    account: account,
    relationship: relationship,
    verifyCredentials: verifyCredentials
  })
}
