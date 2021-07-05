import safariIdbReady from 'safari-14-idb-fix'
import { isWebKit } from './userAgent/isWebKit.js'

// workaround for a safari 14 bug, see https://github.com/jakearchibald/safari-14-idb-fix
export async function idbReady () {
  if (!isWebKit()) {
    return
  }
  if (typeof indexedDB === 'undefined' || !indexedDB.databases) {
    // fix for https://github.com/jakearchibald/safari-14-idb-fix/pull/2
    return
  }
  await safariIdbReady()
}
