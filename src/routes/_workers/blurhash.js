import { decode as decodeBlurHash } from 'blurhash'
import registerPromiseWorker from 'promise-worker/register'
import { BLURHASH_RESOLUTION as RESOLUTION } from '../_static/blurhash'

const isChrome = /Chrome/.test(navigator.userAgent)

// Disabled in Chrome because convertToBlob() is slow
// https://github.com/nolanlawson/pinafore/issues/1396
const OFFSCREEN_CANVAS = !isChrome && typeof OffscreenCanvas === 'function'
  ? new OffscreenCanvas(RESOLUTION, RESOLUTION) : null
const OFFSCREEN_CANVAS_CONTEXT_2D = OFFSCREEN_CANVAS
  ? OFFSCREEN_CANVAS.getContext('2d') : null

registerPromiseWorker(async (encoded) => {
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
})
