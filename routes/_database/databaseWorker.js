// this code runs worker-side and is called by database.worker.js
import registerPromiseWorker from 'promise-worker/register'

import * as databaseApi from './databaseApi'

registerPromiseWorker(([func, args]) => {
  return databaseApi[func].apply(null, args)
})
