// this code runs client side and proxies to the worker via postMessage
import Worker from './databaseWorker.js'
import PromiseWorker from 'promise-worker'

const worker = new PromiseWorker(new Worker())

export const database = new Proxy({}, {
  get (target, key) {
    if (!target[key]) {
      target[key] = function () {
        let args = []
        for (let i = 0; i < arguments.length; i++) {
          args.push(arguments[i])
        }
        return worker.postMessage([key, args])
      }
    }
    return target[key]
  }
})
