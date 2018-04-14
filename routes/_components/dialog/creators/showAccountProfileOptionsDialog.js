import AccountProfileOptionsDialog from '../components/AccountProfileOptionsDialog.html'
import { createDialogElement } from '../helpers/createDialogElement'
import { createDialogId } from '../helpers/createDialogId'

export default function showAccountProfileOptionsDialog (account) {
  let dialog = new AccountProfileOptionsDialog({
    target: createDialogElement(),
    data: {
      id: createDialogId(),
      label: 'Profile options dialog',
      title: '',
      account: account
    }
  })
  dialog.show()
}
