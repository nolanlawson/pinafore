import MediaDialog from '../components/MediaDialog.html'
import { showDialog } from '../lifecycle/showDialog'

export default function showMediaDialog (mediaItems, scrolledItem) {
  return showDialog(MediaDialog, {
    label: 'Media dialog',
    mediaItems,
    scrolledItem
  })
}
