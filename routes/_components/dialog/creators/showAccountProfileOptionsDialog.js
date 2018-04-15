import AccountProfileOptionsDialog from '../components/AccountProfileOptionsDialog.html'
import { createDialogElement } from '../helpers/createDialogElement'
import { createDialogId } from '../helpers/createDialogId'

export function showAccountProfileOptionsDialog (account, relationship) {
  let dialog = new AccountProfileOptionsDialog({
    target: createDialogElement(),
    data: {
      id: createDialogId(),
      label: 'Profile options dialog',
      title: '',
      account: account,
      relationship: relationship
    }
  })
  dialog.show()
}
