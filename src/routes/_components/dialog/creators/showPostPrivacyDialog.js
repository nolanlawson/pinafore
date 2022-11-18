import PostPrivacyDialog from '../components/PostPrivacyDialog.html'
import { showDialog } from './showDialog.js'

export default function showPostPrivacyDialog (realm) {
  return showDialog(PostPrivacyDialog, {
    label: 'intl.postPrivacy',
    title: 'intl.postPrivacy',
    realm
  })
}
