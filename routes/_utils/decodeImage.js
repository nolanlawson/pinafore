import { mark, stop } from './marks'

async function doDecodeImage (img) {
  if (typeof img.decode === 'function') {
    return img.decode()
  }
  return new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = reject
  })
}

export async function decodeImage (img) {
  mark('decodeImage')
  let res = await doDecodeImage(img)
  stop('decodeImage')
  return res
}
