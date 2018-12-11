import * as sapper from '../__sapper__/client.js'
import { loadPolyfills } from './routes/_utils/loadPolyfills'
import './routes/_utils/serviceWorkerClient'
import './routes/_utils/historyEvents'
import './routes/_utils/loadingMask'

loadPolyfills().then(() => {
  console.log('init()')
  sapper.start({ target: document.querySelector('#sapper') })
})

if (module.hot) {
  module.hot.accept()
}
