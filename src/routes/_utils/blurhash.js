import { decode as decodeBlurHash } from 'blurhash'
import { mark, stop } from './marks'

const RESOLUTION = 32
let canvas

export function decode (blurhash) {
  mark('computeBlurhash')
  const pixels = decodeBlurHash(blurhash, RESOLUTION, RESOLUTION)

  if (pixels) {
    canvas = canvas || document.createElement('canvas')
    canvas.height = RESOLUTION
    canvas.width = RESOLUTION
    const imageData = new window.ImageData(pixels, RESOLUTION, RESOLUTION)
    canvas.getContext('2d').putImageData(imageData, 0, 0)
    const base64Image = canvas.toDataURL()
    stop('computeBlurhash')
    return base64Image
  }

  stop('computeBlurhash')
}
