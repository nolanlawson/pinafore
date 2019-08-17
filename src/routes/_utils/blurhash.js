import BlurhashWorker from 'worker-loader!../_workers/blurhash' // eslint-disable-line
import PromiseWorker from 'promise-worker'
import { BLURHASH_RESOLUTION as RESOLUTION } from '../_static/blurhash'
import QuickLRU from 'quick-lru'

const CACHE = new QuickLRU({ maxSize: 100 })

let worker
let canvas
let canvasContext2D

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
  let result = CACHE.get(blurhash)
  if (!result) {
    result = await decodeWithoutCache(blurhash)
    CACHE.set(blurhash, result)
  }
  return result
}
