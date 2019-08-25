import { importTesseract } from '../_utils/asyncModules'

let worker

export async function tesseract (image) {
  if (!worker) {
    const { TesseractWorker } = await importTesseract()
    worker = new TesseractWorker({
      workerPath: '/worker.min.js',
      langPath: '/',
      corePath: '/tesseract-core.wasm.js'
    })
  }
  const promise = worker.recognize(image)
  promise.progress(_ => console.log('progress', _))
  const res = await promise
  return res.text
}
