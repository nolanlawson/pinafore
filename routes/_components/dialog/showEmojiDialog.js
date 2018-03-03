import EmojiDialog from './EmojiDialog.html'

export function showEmojiDialog (realm) {
  let emojiDialog = new EmojiDialog({
    target: document.getElementById('modal-dialog'),
    data: {
      label: 'Emoji dialog',
      title: 'Custom emoji',
      realm
    }
  })
  emojiDialog.show()
}
