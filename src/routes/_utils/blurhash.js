import { decode as decodeBlurHash } from 'blurhash'
import { mark, stop } from './marks'

const RESOLUTION = 32
let canvas

export function decode (blurhash) {
  mark('computeBlurhash')
  try {
    const pixels = decodeBlurHash(blurhash, RESOLUTION, RESOLUTION)

    if (pixels) {
      if (!canvas) {
        canvas = canvas || document.createElement('canvas')
        canvas.height = RESOLUTION
        canvas.width = RESOLUTION
      }
      const imageData = new ImageData(pixels, RESOLUTION, RESOLUTION)
      canvas.getContext('2d').putImageData(imageData, 0, 0)
      return canvas.toDataURL()
    }
  } finally {
    stop('computeBlurhash')
  }
}
