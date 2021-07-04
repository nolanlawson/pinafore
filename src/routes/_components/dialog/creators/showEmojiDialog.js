import EmojiDialog from '../components/EmojiDialog.html'
import { showDialog } from './showDialog.js'

export default function showEmojiDialog (realm) {
  return showDialog(EmojiDialog, {
    label: 'intl.emoji',
    title: 'intl.emoji',
    realm
  })
}
