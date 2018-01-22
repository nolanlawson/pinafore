import worker from 'workerize-loader!./databaseCore'
const database = process.browser && worker()

export {
  database
}