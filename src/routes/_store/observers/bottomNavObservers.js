const style = process.browser && document.getElementById('theBottomNavStyle')

export function bottomNavObservers (store) {
  if (!process.browser) {
    return
  }

  store.observe('bottomNav', bottomNav => {
    // disables or enables the style
    style.setAttribute('media', bottomNav ? 'all' : 'only x') // disable or enable the style
  }, { init: false }) // init: false because the inline script takes care of it
}
