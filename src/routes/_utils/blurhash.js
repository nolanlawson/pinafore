import BlurhashWorker from 'worker-loader!../_workers/blurhash' // eslint-disable-line
import PromiseWorker from 'promise-worker'
import { BLURHASH_RESOLUTION as RESOLUTION } from '../_static/blurhash'

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

// canvas is the backup if we can't use the worker
async function decodeUsingCanvas (imageData) {
  initCanvas()
  canvasContext2D.putImageData(imageData, 0, 0)
  const blob = await new Promise(resolve => canvas.toBlob(resolve))
  return URL.createObjectURL(blob)
}

export async function decode (blurhash) {
  init()
  // TODO: should maintain a cache outside of worker to avoid round-trip for cached data
  const { decoded, imageData } = await worker.postMessage(blurhash)
  if (decoded) {
    return decoded
  }
  return decodeUsingCanvas(imageData)
}
