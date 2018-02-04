import ImageDialog from '../_components/status/ImageDialog.html'
import { createDialogElement } from './dialogs'

export function showImageDialog(poster, src, type, width, height, description) {
  let imageDialog = new ImageDialog({
    target: createDialogElement('Image dialog'),
    data: {
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