import PostPrivacyDialog from './PostPrivacyDialog.html'

export function showPostPrivacyDialog (realm) {
  let dialog = new PostPrivacyDialog({
    target: document.getElementById('modal-dialog'),
    data: {
      label: 'Post privacy dialog',
      title: 'Post privacy',
      realm: realm
    }
  })
  dialog.show()
}
