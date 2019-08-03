import { createDialogElement } from '../helpers/createDialogElement'
import { createDialogId } from '../helpers/createDialogId'

export function showDialog (Dialog, data) {
  const dialog = new Dialog({
    target: createDialogElement(),
    data: Object.assign({
      id: createDialogId()
    }, data)
  })
  dialog.show()
  return dialog
}
