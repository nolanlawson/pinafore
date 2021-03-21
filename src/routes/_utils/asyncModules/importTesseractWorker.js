export const importTesseractWorker = () => import(
  '../../_utils/tesseractWorker.js'
).then(mod => mod.default)
