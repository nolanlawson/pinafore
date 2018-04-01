import EmojiDialog from './EmojiDialog.html'
import { createDialogElement } from './createDialogElement'

export function showEmojiDialog (realm) {
  let emojiDialog = new EmojiDialog({
    target: createDialogElement(),
    data: {
      label: 'Emoji dialog',
      title: 'Custom emoji',
      realm
    }
  })
  emojiDialog.show()
}
