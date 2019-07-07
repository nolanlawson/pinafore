import MediaFocalPointDialog from '../components/MediaFocalPointDialog.html'
import { showDialog } from './showDialog'

export default function showMediaFocalPointDialog (realm, index) {
  return showDialog(MediaFocalPointDialog, {
    label: 'Change preview dialog',
    title: 'Change preview (focal point)',
    realm,
    index
  })
}
