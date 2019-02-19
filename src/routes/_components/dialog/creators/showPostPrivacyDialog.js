import PostPrivacyDialog from '../components/PostPrivacyDialog.html'
import { showDialog } from './showDialog'

export default function showPostPrivacyDialog (realm) {
  return showDialog(PostPrivacyDialog, {
    label: 'Post privacy dialog',
    title: 'Post privacy',
    realm: realm
  })
}
