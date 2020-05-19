import '../_thirdparty/regenerator-runtime/runtime.js'
import { decode as decodeBlurHash, setupPromise } from '../_thirdparty/blurhash-wasm/blurhash-wasm'
import registerPromiseWorker from 'promise-worker/register'
import { BLURHASH_RESOLUTION as RESOLUTION } from '../_static/blurhash'
import { isChromePre82 } from '../_utils/userAgent/isChromePre82'

// Disabled in Chrome because convertToBlob() is slow
// https://github.com/nolanlawson/pinafore/issues/1396
const OFFSCREEN_CANVAS = !isChromePre82() && typeof OffscreenCanvas === 'function'
  ? new OffscreenCanvas(RESOLUTION, RESOLUTION) : null
const OFFSCREEN_CANVAS_CONTEXT_2D = OFFSCREEN_CANVAS
  ? OFFSCREEN_CANVAS.getContext('2d') : null

registerPromiseWorker(async (encoded) => {
  await setupPromise
  performance.mark('blurhash')
  const pixels = decodeBlurHash(encoded, RESOLUTION, RESOLUTION)
  performance.measure('blurhash', 'blurhash')

  if (!pixels) {
    throw new Error('decode did not return any pixels')
  }
  const imageData = new ImageData(Uint8ClampedArray.from(pixels), RESOLUTION, RESOLUTION)

  if (OFFSCREEN_CANVAS) {
    OFFSCREEN_CANVAS_CONTEXT_2D.putImageData(imageData, 0, 0)
    const blob = await OFFSCREEN_CANVAS.convertToBlob()
    const decoded = URL.createObjectURL(blob)
    return { decoded, imageData: null }
  } else {
    return { imageData, decoded: null }
  }
})
