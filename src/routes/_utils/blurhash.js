import { decode as decodeBlurHash } from 'blurhash'

let canvas

export function decode (blurhash) {
  const pixels = decodeBlurHash(blurhash, 320, 320)

  if (pixels) {
    canvas = canvas || document.createElement('canvas')
    const imageData = new window.ImageData(pixels, 320, 320)
    canvas.getContext('2d').putImageData(imageData, 0, 0)
    return canvas.toDataURL()
  }
}
