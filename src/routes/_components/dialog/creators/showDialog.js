import { createDialogElement } from '../helpers/createDialogElement.js'
import { createDialogId } from '../helpers/createDialogId.js'

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
