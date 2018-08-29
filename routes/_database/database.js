// workerize version
let database
if (process.browser) {
  const worker = require('./databaseWorker')
  database = worker()
}
export { database }
