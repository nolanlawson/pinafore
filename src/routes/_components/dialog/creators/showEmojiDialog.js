import EmojiDialog from '../components/EmojiDialog.html'
import { showDialog } from './showDialog'

export default function showEmojiDialog (realm) {
  return showDialog(EmojiDialog, {
    label: 'Emoji dialog',
    title: 'Emoji',
    realm
  })
}
