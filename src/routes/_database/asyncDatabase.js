// All database functions are asynchronous, so we can just proxy here and
// put an async import of the database, to avoid including it in the main bundle
// (which doesn't need to run when the user isn't logged in).

import { importDatabase } from '../_utils/asyncModules'

const handler = {
  get: function (obj, prop) {
    return async function (...args) {
      if (!obj[prop]) {
        let database = await importDatabase()
        obj[prop] = database[prop]
      }
      return obj[prop].apply(null, args)
    }
  }
}

export const asyncDatabase = new Proxy({}, handler)
