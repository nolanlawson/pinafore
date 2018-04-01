import VideoDialog from './VideoDialog.html'
import { createDialogElement } from './createDialogElement'

export function showVideoDialog (poster, src, width, height, description) {
  let videoDialog = new VideoDialog({
    target: createDialogElement(),
    data: {
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
