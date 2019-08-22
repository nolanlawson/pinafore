import BlurhashWorker from '../_workers/blurhash'
import PromiseWorker from 'promise-worker'
import { BLURHASH_RESOLUTION as RESOLUTION } from '../_static/blurhash'
import { QuickLRU } from '../_thirdparty/quick-lru/quick-lru'

// A timeline will typically show 20-30 articles at once in the virtual list. The maximum number
// of sensitive images per article is 4. 30*4=120, so this is a very conservative number.
// Blurhash blobs seem to range from ~1.2-2kB, so this cache could grow to about 2kB*150=300kB max.
const cache = new QuickLRU({ maxSize: 150 })

let worker
let canvas
let canvasContext2D

cache.on('evict', (evictedUrl, blurhash) => {
  console.log('evicted URL', evictedUrl, 'with blurhash', blurhash)
  URL.revokeObjectURL(evictedUrl)
})

export function init () {
  worker = worker || new PromiseWorker(new BlurhashWorker())
}

function initCanvas () {
  if (!canvas) {
    canvas = document.createElement('canvas')
    canvas.height = RESOLUTION
    canvas.width = RESOLUTION
    canvasContext2D = canvas.getContext('2d')
  }
}

// canvas is the backup if we can't use OffscreenCanvas
async function decodeUsingCanvas (imageData) {
  initCanvas()
  canvasContext2D.putImageData(imageData, 0, 0)
  const blob = await new Promise(resolve => canvas.toBlob(resolve))
  return URL.createObjectURL(blob)
}

async function decodeWithoutCache (blurhash) {
  init()
  const { decoded, imageData } = await worker.postMessage(blurhash)
  if (decoded) {
    return decoded
  }
  return decodeUsingCanvas(imageData)
}

export async function decode (blurhash) {
  let result = cache.get(blurhash)
  if (!result) {
    result = await decodeWithoutCache(blurhash)
    cache.set(blurhash, result)
  }
  return result
}
