import PostPrivacyDialog from '../components/PostPrivacyDialog.html'
import { createDialogElement } from '../helpers/createDialogElement.js'
import { createDialogId } from '../helpers/createDialogId.js'

export default function showPostPrivacyDialog (realm) {
  let dialog = new PostPrivacyDialog({
    target: createDialogElement(),
    data: {
      id: createDialogId(),
      label: 'Post privacy dialog',
      title: 'Post privacy',
      realm: realm
    }
  })
  dialog.show()
}
