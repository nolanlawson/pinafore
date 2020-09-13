import * as sapper from '../__sapper__/client.js'
import './routes/_utils/serviceWorkerClient'
import './routes/_utils/historyEvents'
import './routes/_utils/loadingMask'
import './routes/_utils/forceOnline'
import { mark, stop } from './routes/_utils/marks'
import { loadPolyfills } from './routes/_utils/loadPolyfills'
import { loadNonCriticalPolyfills } from './routes/_utils/loadNonCriticalPolyfills'

mark('loadPolyfills')
loadPolyfills().then(() => {
  stop('loadPolyfills')
  mark('sapperStart')
  sapper.start({ target: document.querySelector('#sapper') })
  stop('sapperStart')
  /* no await */ loadNonCriticalPolyfills()
})

console.log('process.env.NODE_ENV', process.env.NODE_ENV)

if (module.hot) {
  module.hot.accept()
}
