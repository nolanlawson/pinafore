import { importTesseractWorker } from '../_utils/asyncModules'

export async function runTesseract (image) {
  const worker = await importTesseractWorker()

  // TODO: have to trick tesseract into not creating a blob URL because that would break our CSP
  // see https://github.com/naptha/tesseract.js/pull/322
  let promise
  const OldBlob = window.Blob
  window.Blob = null
  try {
    promise = worker.recognize(image)
  } finally {
    window.Blob = OldBlob
  }
  promise.progress(_ => console.log('progress', _))
  const res = await promise
  return res.text
}
