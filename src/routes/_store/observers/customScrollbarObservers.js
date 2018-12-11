let theScrollbarStyle = process.browser && document.getElementById('theScrollbarStyle')

export function customScrollbarObservers (store) {
  store.observe('disableCustomScrollbars', disableCustomScrollbars => {
    if (!process.browser) {
      return
    }

    // disables or enables the style
    theScrollbarStyle.setAttribute('media', disableCustomScrollbars ? 'only x' : 'all')
  }, { init: false })
}
