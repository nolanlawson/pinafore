import { store } from '../store.js'

const centerNavStyle = process.browser && document.getElementById('theCenterNavStyle')

export function centerNavObservers () {
  store.observe('centerNav', centerNav => {
    if (!process.browser) {
      return
    }

    // disables or enables the style
    centerNavStyle.setAttribute('media', centerNav ? 'all' : 'only x')
  }, { init: false })
}
