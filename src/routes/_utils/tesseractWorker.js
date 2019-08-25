import workerPath from 'tesseract.js/dist/worker.min.js'
// TODO: we should use .wasm instead of .wasm.js. But currently can't because:
// 1. not supported https://github.com/naptha/tesseract.js/blob/9f1e782/docs/local-installation.md#corepath
// 2. webpack defaultRules issues (fixable with https://github.com/webpack/webpack/issues/8412#issuecomment-445586591)

// We should explore this at a later date.
import corePath from 'tesseract.js-core/tesseract-core.wasm.js'
import { TesseractWorker } from 'tesseract.js'

// tesseract has a bug where
const { origin } = location
const tesseractWorker = new TesseractWorker({
  workerPath: `${origin}/${workerPath}`,
  langPath: `${origin}/`,
  corePath: `${origin}/${corePath}`
})

export default tesseractWorker
