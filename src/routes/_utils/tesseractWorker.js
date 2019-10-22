// TODO: we should use .wasm instead of .wasm.js. But currently can't because:
// 1. not supported https://github.com/naptha/tesseract.js/issues/282#issuecomment-492263336
// 2. webpack defaultRules issues (fixable with https://github.com/webpack/webpack/issues/8412#issuecomment-445586591)
// We should explore this at a later date.
import corePath from 'tesseract.js-core/tesseract-core.wasm.js'
import workerPath from 'tesseract.js/dist/worker.min.js'
import { createWorker } from 'tesseract.js'

const { origin } = location

export default () => createWorker({
  workerPath: `${origin}/${workerPath}`,
  langPath: `${origin}/`,
  corePath: `${origin}/${corePath}`,
  cacheMethod: 'none', // this file is huge, so I'd prefer to cache it in the regular HTTP cache instead of origin cache
  workerBlobURL: false,
  logger: message => {
    console.log(message)
  }
})
