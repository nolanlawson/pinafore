import VideoDialog from '../_components/VideoDialog.html'

export function showVideoDialog(poster, src, width, height) {
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
      height: height
    }
  })
  videoDialog.showModal()
}