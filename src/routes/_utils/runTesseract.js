import { importTesseractWorker } from '../_utils/asyncModules'

const DESTROY_WORKER_DELAY = 10000 // 5 minutes

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
    await worker.load()
    await worker.loadLanguage('eng')
    await worker.initialize('eng')
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

async function recognize (url, onProgress) {
  // TODO: it seems hacky that we have to spy on the tesseract worker to figure out its progress
  const listener = event => {
    const { data } = event
    if (onProgress && data.status === 'progress' && steps.find(({ status }) => status === data.data.status)) {
      onProgress(getTotalProgress(data.data))
    }
  }
  worker.worker.addEventListener('message', listener)
  try {
    const res = await worker.recognize(url, 'eng')
    return res
  } finally {
    worker.worker.removeEventListener('message', listener)
  }
}

export async function runTesseract (url, onProgress) {
  cancelDestroyWorker()
  await initWorker()
  try {
    const res = await recognize(url, onProgress)
    console.log('result', res)
    return res.data.text
  } finally {
    scheduleDestroyWorker()
  }
}
