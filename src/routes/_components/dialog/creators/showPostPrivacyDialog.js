import PostPrivacyDialog from '../components/PostPrivacyDialog.html'
import { showDialog } from '../lifecycle/showDialog'

export default function showPostPrivacyDialog (realm) {
  return showDialog(PostPrivacyDialog, {
    label: 'Post privacy dialog',
    title: 'Post privacy',
    realm: realm
  })
}
