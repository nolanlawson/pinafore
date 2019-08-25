import { importTesseractWorker } from '../_utils/asyncModules'

export async function tesseract (image) {
  const worker = await importTesseractWorker()
  const promise = worker.recognize(image)
  promise.progress(_ => console.log('progress', _))
  const res = await promise
  return res.text
}
