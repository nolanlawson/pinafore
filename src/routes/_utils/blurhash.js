import { decode as decodeBlurHash } from 'blurhash'
import { mark, stop } from './marks'

let canvas

export function decode (blurhash) {
  mark('computeBlurhash')
  const pixels = decodeBlurHash(blurhash, 32, 32)

  if (pixels) {
    canvas = canvas || document.createElement('canvas')
    canvas.height = 32
    canvas.width = 32
    const imageData = new window.ImageData(pixels, 32, 32)
    canvas.getContext('2d').putImageData(imageData, 0, 0)
    const base64Image = canvas.toDataURL()
    stop('computeBlurhash')
    return base64Image
  }

  stop('computeBlurhash')
}
