import EmojiDialog from '../components/EmojiDialog.html'
import { createDialogElement } from '../helpers/createDialogElement.js'
import { createDialogId } from '../helpers/createDialogId.js'

export default function showEmojiDialog (realm) {
  let emojiDialog = new EmojiDialog({
    target: createDialogElement(),
    data: {
      id: createDialogId(),
      label: 'Emoji dialog',
      title: 'Custom emoji',
      realm
    }
  })
  emojiDialog.show()
}
