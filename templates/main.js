import { init } from 'sapper/runtime.js'
import { loadPolyfills } from '../routes/_utils/loadPolyfills'
import '../routes/_utils/serviceWorkerClient'
import '../routes/_utils/historyEvents'
import '../routes/_utils/loadingMask'

console.log('1')
console.log('2')
console.log('3')

loadPolyfills().then(() => {
  console.log('init()')
  // `routes` is an array of route objects injected by Sapper
  init(document.querySelector('#sapper'), __routes__)
})
