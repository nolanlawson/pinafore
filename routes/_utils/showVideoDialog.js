import VideoDialog from '../_components/status/VideoDialog.html'

export function showVideoDialog(poster, src, width, height, description) {
  let dialog = document.createElement('dialog')
  dialog.classList.add('video-dialog')
  dialog.setAttribute('aria-label', 'Video dialog')
  document.body.appendChild(dialog)
  let videoDialog = new VideoDialog({
    target: dialog,
    data: {
      poster: poster,
      src: src,
      dialog: dialog,
      width: width,
      height: height,
      description: description
    }
  })
  videoDialog.showModal()
}