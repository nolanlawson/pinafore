import idbKeyVal from 'idb-keyval'
import { blobToBase64 } from '../_utils/binary'

let databasePromise

if (process.browser) {
  databasePromise = Promise.resolve().then(async () => {
    let token = await idbKeyVal.get('secure_token')
    if (!token) {
      let array = new Uint32Array(1028)
      crypto.getRandomValues(array);
      let token = await blobToBase64(new Blob([array]))
      await idbKeyVal.set('secure_token', token)
    }
    return idbKeyVal
  })
} else {
  databasePromise = Promise.resolve()
}

export { databasePromise }
