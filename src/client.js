import './routes/_thirdparty/regenerator-runtime/runtime.js'
import * as sapper from '../__sapper__/client.js'
import { loadPolyfills } from './routes/_utils/loadPolyfills'
import './routes/_utils/serviceWorkerClient'
import './routes/_utils/historyEvents'
import './routes/_utils/loadingMask'
import './routes/_utils/forceOnline'

loadPolyfills().then(() => {
  console.log('init()')
  sapper.start({ target: document.querySelector('#sapper') })
})

console.log('process.env.NODE_ENV', process.env.NODE_ENV)

if (module.hot) {
  module.hot.accept()
}
