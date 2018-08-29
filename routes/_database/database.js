// workerize version
import worker from './databaseWorker'
const database = worker()
export { database }
