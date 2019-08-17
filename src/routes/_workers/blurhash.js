import { decode as decodeBlurHash } from 'blurhash'
import QuickLRU from 'quick-lru'
import registerPromiseWorker from 'promise-worker/register'
import { BLURHASH_RESOLUTION as RESOLUTION } from '../_static/blurhash'

const OFFSCREEN_CANVAS = typeof OffscreenCanvas === 'function'
  ? new OffscreenCanvas(RESOLUTION, RESOLUTION) : null
const OFFSCREEN_CANVAS_CONTEXT_2D = OFFSCREEN_CANVAS
  ? OFFSCREEN_CANVAS.getContext('2d') : null
const CACHE = new QuickLRU({ maxSize: 100 })

async function decodeWithoutCache (encoded) {
  const pixels = decodeBlurHash(encoded, RESOLUTION, RESOLUTION)

  if (!pixels) {
    throw new Error('decode did not return any pixels')
  }
  const imageData = new ImageData(pixels, RESOLUTION, RESOLUTION)

  if (OFFSCREEN_CANVAS) {
    OFFSCREEN_CANVAS_CONTEXT_2D.putImageData(imageData, 0, 0)
    const blob = await OFFSCREEN_CANVAS.convertToBlob()
    const decoded = URL.createObjectURL(blob)
    return { decoded, imageData: null }
  } else {
    return { imageData, decoded: null }
  }
}

registerPromiseWorker(async (encoded) => {
  if (CACHE.has(encoded)) {
    const { decoded, imageData } = CACHE.get(encoded)
    return { encoded, decoded, imageData }
  }
  const { decoded, imageData } = await decodeWithoutCache(encoded)
  CACHE.set(encoded, { decoded, imageData })
  return { encoded, decoded, imageData }
})
