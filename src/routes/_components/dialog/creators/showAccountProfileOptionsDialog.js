import AccountProfileOptionsDialog from '../components/AccountProfileOptionsDialog.html'
import { createDialogElement } from '../helpers/createDialogElement.js'
import { createDialogId } from '../helpers/createDialogId.js'

export default function showAccountProfileOptionsDialog (account, relationship, verifyCredentials) {
  let dialog = new AccountProfileOptionsDialog({
    target: createDialogElement(),
    data: {
      id: createDialogId(),
      label: 'Profile options dialog',
      title: '',
      account: account,
      relationship: relationship,
      verifyCredentials: verifyCredentials
    }
  })
  dialog.show()
}
