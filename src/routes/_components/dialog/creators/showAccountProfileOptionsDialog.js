import AccountProfileOptionsDialog from '../components/AccountProfileOptionsDialog.html'
import { showDialog } from './showDialog.js'

export default function showAccountProfileOptionsDialog (account, relationship, verifyCredentials) {
  return showDialog(AccountProfileOptionsDialog, {
    label: 'intl.profileOptions',
    title: '',
    account,
    relationship,
    verifyCredentials
  })
}
