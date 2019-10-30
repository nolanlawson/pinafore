export const importTesseractWorker = () => import(
  /* webpackChunkName: 'tesseractWorker' */ '../../_utils/tesseractWorker.js'
).then(mod => mod.default)
