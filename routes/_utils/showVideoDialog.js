import VideoDialog from '../_components/status/VideoDialog.html'

export function showVideoDialog(poster, src, width, height, description) {
  let videoDialog = new VideoDialog({
    target: document.getElementById('modal-dialog'),
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