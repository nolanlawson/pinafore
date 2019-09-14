import { decodeImage } from './decodeImage'

export async function getImageNativeDimensions (url) {
  const img = document.createElement('img')
  img.src = url
  await decodeImage(img)
  return {
    width: img.naturalWidth,
    height: img.naturalHeight
  }
}
