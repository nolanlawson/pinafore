/*
import worker from 'workerize-loader!./databaseCore'
export const database = process.browser && worker()
*/

import * as dbCore from './databaseCore'

export { dbCore as database }