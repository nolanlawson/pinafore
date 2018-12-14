import ImageDialog from '../components/ImageDialog.html'
import { createDialogElement } from '../helpers/createDialogElement.js'
import { createDialogId } from '../helpers/createDialogId.js'

export default function showImageDialog (poster, src, type, width, height, description) {
  let imageDialog = new ImageDialog({
    target: createDialogElement(),
    data: {
      id: createDialogId(),
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
