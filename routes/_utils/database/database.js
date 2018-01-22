import worker from 'workerize-loader!./databaseInsideWorker'

import * as databaseInsideWorker from './databaseInsideWorker'

// workerize-loader causes weirdness during development
let database = process.browser && process.env.NODE_ENV === 'production' ? worker() : databaseInsideWorker

export {
  database
}