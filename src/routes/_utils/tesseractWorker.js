import workerPath from 'tesseract.js/dist/worker.min.js'
import 'tesseract.js/dist/worker.min.js.map' // merely to get this included in webpack
import corePath from 'tesseract.js-core/tesseract-core.wasm.js'
import { TesseractWorker } from 'tesseract.js'

const { origin } = location
const tesseractWorker = new TesseractWorker({
  workerPath: `${origin}/${workerPath}`,
  langPath: `${origin}/`,
  corePath: `${origin}/${corePath}`
})

export default tesseractWorker
