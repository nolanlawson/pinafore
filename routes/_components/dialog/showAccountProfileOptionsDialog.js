import AccountProfileOptionsDialog from './AccountProfileOptionsDialog.html'
import { createDialogElement } from './createDialogElement'

export function showAccountProfileOptionsDialog (account) {
  let dialog = new AccountProfileOptionsDialog({
    target: createDialogElement(),
    data: {
      label: 'Profile options dialog',
      title: '',
      account: account
    }
  })
  dialog.show()
}
