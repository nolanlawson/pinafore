import { decode as decodeBlurHash } from 'blurhash'

const RESOLUTION = 32
let canvas

export async function decode (blurhash) {
  return new Promise((resolve, reject) => {
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
        canvas.toBlob(blob => {
          resolve(URL.createObjectURL(blob))
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}
