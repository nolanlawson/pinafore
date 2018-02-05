import ImageDialog from './ImageDialog.html'

export function showImageDialog(poster, src, type, width, height, description) {
  let imageDialog = new ImageDialog({
    target: document.getElementById('modal-dialog'),
    data: {
      label: 'Image dialog',
      poster,
      src,
      type,
      width,
      height,
      description
    }
  })
  imageDialog.show()
}