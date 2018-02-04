import VideoDialog from '../_components/status/VideoDialog.html'
import { createDialogElement } from './dialogs'

export function showVideoDialog(poster, src, width, height, description) {
  let videoDialog = new VideoDialog({
    target: createDialogElement('Video dialog'),
    data: {
      poster: poster,
      src: src,
      width: width,
      height: height,
      description: description
    }
  })
  videoDialog.show()
}