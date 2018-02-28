import EmojiDialog from './EmojiDialog.html'

export function showEmojiDialog () {
  let emojiDialog = new EmojiDialog({
    target: document.getElementById('modal-dialog'),
    data: {
      label: 'Emoji dialog',
      title: 'Custom emoji'
    }
  })
  emojiDialog.show()
}
