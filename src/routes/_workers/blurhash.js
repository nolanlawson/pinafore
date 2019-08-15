import { decode as decodeBlurHash } from 'blurhash'
import QuickLRU from 'quick-lru'

const RESOLUTION = 32
const OFFSCREEN_CANVAS = typeof OffscreenCanvas === 'function'
  ? new OffscreenCanvas(RESOLUTION, RESOLUTION) : null
const CACHE = new QuickLRU({ maxSize: 100 })

self.addEventListener('message', ({ data: { encoded } }) => {
  try {
    if (CACHE.has(encoded)) {
      if (OFFSCREEN_CANVAS) {
        postMessage({ encoded, decoded: CACHE.get(encoded), imageData: null, error: null })
      } else {
        postMessage({ encoded, imageData: CACHE.get(encoded), decoded: null, error: null })
      }
    }

    const pixels = decodeBlurHash(encoded, RESOLUTION, RESOLUTION)

    if (pixels) {
      const imageData = new ImageData(pixels, RESOLUTION, RESOLUTION)

      if (OFFSCREEN_CANVAS) {
        OFFSCREEN_CANVAS.getContext('2d').putImageData(imageData, 0, 0)
        OFFSCREEN_CANVAS.convertToBlob().then(blob => {
          const decoded = URL.createObjectURL(blob)
          CACHE.set(encoded, decoded)
          postMessage({ encoded, decoded, imageData: null, error: null })
        }).catch(error => {
          postMessage({ encoded, decoded: null, imageData: null, error })
        })
      } else {
        CACHE.set(encoded, imageData)
        postMessage({ encoded, imageData, decoded: null, error: null })
      }
    } else {
      postMessage({ encoded, decoded: null, imageData: null, error: new Error('decode did not return any pixels') })
    }
  } catch (error) {
    postMessage({ encoded, decoded: null, imageData: null, error })
  }
})
