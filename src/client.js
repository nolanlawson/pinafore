import * as sapper from '../__sapper__/client.js'
import { loadPolyfills } from './routes/_utils/loadPolyfills'
import './routes/_utils/serviceWorkerClient'
import './routes/_utils/historyEvents'
import './routes/_utils/loadingMask'

import { snackbar } from './routes/_components/snackbar/snackbar'

loadPolyfills().then(() => {
  console.log('init()')
  sapper.start({ target: document.querySelector('#sapper') })
})

console.log('process.env.NODE_ENV', process.env.NODE_ENV)

setTimeout(() => {
  snackbar.announce('App update available.', 'Refresh')
}, 2000)

if (module.hot) {
  module.hot.accept()
}
