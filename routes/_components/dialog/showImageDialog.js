import ImageDialog from './ImageDialog.html'
import { createDialogElement } from './createDialogElement'

export function showImageDialog (poster, src, type, width, height, description) {
  let imageDialog = new ImageDialog({
    target: createDialogElement(),
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
