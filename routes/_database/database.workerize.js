// workerize version, used in production
const database = process.browser && require('./databaseWorker.js')()
export { database }
