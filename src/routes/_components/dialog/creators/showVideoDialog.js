import VideoDialog from '../components/VideoDialog.html'
import { createDialogElement } from '../helpers/createDialogElement.js'
import { createDialogId } from '../helpers/createDialogId.js'

export default function showVideoDialog (poster, src, width, height, description) {
  let videoDialog = new VideoDialog({
    target: createDialogElement(),
    data: {
      id: createDialogId(),
      label: 'Video dialog',
      poster,
      src,
      width,
      height,
      description
    }
  })
  videoDialog.show()
}
