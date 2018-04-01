import PostPrivacyDialog from './PostPrivacyDialog.html'
import { createDialogElement } from './createDialogElement'

export function showPostPrivacyDialog (realm) {
  let dialog = new PostPrivacyDialog({
    target: createDialogElement(),
    data: {
      label: 'Post privacy dialog',
      title: 'Post privacy',
      realm: realm
    }
  })
  dialog.show()
}
