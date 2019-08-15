import { decode as decodeBlurHash } from 'blurhash'

const RESOLUTION = 32
const OFFSCREEN_CANVAS = typeof OffscreenCanvas === 'function'
  ? new OffscreenCanvas(RESOLUTION, RESOLUTION) : null

self.addEventListener('message', ({ data: { encoded } }) => {
  try {
    const pixels = decodeBlurHash(encoded, RESOLUTION, RESOLUTION)

    if (pixels) {
      const imageData = new ImageData(pixels, RESOLUTION, RESOLUTION)

      if (OFFSCREEN_CANVAS) {
        OFFSCREEN_CANVAS.getContext('2d').putImageData(imageData, 0, 0)
        OFFSCREEN_CANVAS.convertToBlob().then(blob => {
          postMessage({ encoded, decoded: URL.createObjectURL(blob), imageData: null, error: null })
        }).catch(error => {
          postMessage({ encoded, decoded: null, imageData: null, error })
        })
      } else {
        postMessage({ encoded, imageData, decoded: null, error: null })
      }
    } else {
      postMessage({ encoded, decoded: null, imageData: null, error: new Error('decode did not return any pixels') })
    }
  } catch (error) {
    postMessage({ encoded, decoded: null, imageData: null, error })
  }
})
