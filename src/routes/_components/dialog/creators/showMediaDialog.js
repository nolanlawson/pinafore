import MediaDialog from '../components/MediaDialog.html'
import { createDialogElement } from '../helpers/createDialogElement'
import { createDialogId } from '../helpers/createDialogId'

export default function showMediaDialog (mediaItems, scrolledItem) {
  let dialog = new MediaDialog({
    target: createDialogElement(),
    data: {
      id: createDialogId(),
      label: 'Media dialog',
      mediaItems,
      scrolledItem
    }
  })
  dialog.show()
}
