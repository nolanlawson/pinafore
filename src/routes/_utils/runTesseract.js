import { importTesseractWorker } from '../_utils/asyncModules'

const DESTROY_WORKER_DELAY = 300000 // 5 minutes

// TODO: it's flaky to try to estimate tesseract's total progress this way
const steps = [
  { status: 'loading tesseract core', proportion: 0.05 },
  { status: 'initializing tesseract', proportion: 0.05 },
  { status: 'loading language traineddata', proportion: 0.1 },
  { status: 'initializing api', proportion: 0.2 },
  { status: 'recognizing text', proportion: 0.6 }
]

let worker
let destroyWorkerHandle

async function initWorker () {
  if (!worker) {
    worker = (await importTesseractWorker())()
  }
}

function destroyWorker () {
  console.log('destroying tesseract worker')
  if (worker) {
    worker.terminate()
    worker = null
  }
}

// destroy the worker after a delay to reduce memory usage
function scheduleDestroyWorker () {
  cancelDestroyWorker()
  destroyWorkerHandle = setTimeout(destroyWorker, DESTROY_WORKER_DELAY)
}

function cancelDestroyWorker () {
  if (destroyWorkerHandle) {
    clearTimeout(destroyWorkerHandle)
    destroyWorkerHandle = null
  }
}

function getTotalProgress (progressInfo) {
  const idx = steps.findIndex(({ status }) => progressInfo.status === status)
  let total = 0
  for (let i = 0; i < idx; i++) {
    total += steps[i].proportion
  }
  total += steps[idx].proportion * progressInfo.progress
  return total
}

function recognize (url, onProgress) {
  // TODO: have to trick tesseract into not creating a blob URL because that would break our CSP
  // see https://github.com/naptha/tesseract.js/pull/322
  let promise
  const OldBlob = window.Blob
  window.Blob = null
  try {
    promise = worker.recognize(url)
  } finally {
    window.Blob = OldBlob
  }
  promise.progress(progressInfo => {
    console.log('progress', progressInfo)
    if (onProgress && steps.find(({ status }) => status === progressInfo.status)) {
      onProgress(getTotalProgress(progressInfo))
    }
  })
  return promise
}

export async function runTesseract (url, onProgress) {
  cancelDestroyWorker()
  await initWorker()
  try {
    const { text } = await recognize(url, onProgress)
    return text
  } finally {
    scheduleDestroyWorker()
  }
}
