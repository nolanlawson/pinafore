import { decode as decodeBlurHash } from 'blurhash'
import { mark, stop } from './marks'

let canvas

export function decode (blurhash) {
  mark('computeBlurhash')
  const pixels = decodeBlurHash(blurhash, 320, 320)

  if (pixels) {
    canvas = canvas || document.createElement('canvas')
    const imageData = new window.ImageData(pixels, 320, 320)
    canvas.getContext('2d').putImageData(imageData, 0, 0)
    const base64Image = canvas.toDataURL()
    stop('computeBlurhash')
    return base64Image
  }

  stop('computeBlurhash')
}
