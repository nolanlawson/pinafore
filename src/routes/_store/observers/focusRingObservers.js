const style = process.browser && document.getElementById('theFocusVisibleStyle')

export function focusRingObservers (store) {
  if (!process.browser) {
    return
  }

  store.observe('alwaysShowFocusRing', alwaysShowFocusRing => {
    style.setAttribute('media', alwaysShowFocusRing ? 'only x' : 'all') // disable or enable the style
  })
}
