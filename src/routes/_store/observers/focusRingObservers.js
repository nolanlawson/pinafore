import { supportsFocusVisible } from '../../_utils/supportsFocusVisible'

export function focusRingObservers (store) {
  if (!process.browser) {
    return
  }

  const styleId = supportsFocusVisible() ? 'theFocusVisibleStyle' : 'theFocusVisiblePolyfillStyle'
  const style = document.getElementById(styleId)

  store.observe('alwaysShowFocusRing', alwaysShowFocusRing => {
    style.setAttribute('media', alwaysShowFocusRing ? 'only x' : 'all') // disable or enable the style
  })
}
