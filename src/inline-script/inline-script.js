
// For perf reasons, this script is run inline to quickly set certain styles.
// To allow CSP to work correctly, we also calculate a sha256 hash during
// the build process and write it to checksum.js.

import { testHasLocalStorageOnce } from '../routes/_utils/testStorage'
import { DEFAULT_LIGHT_THEME, DEFAULT_THEME, switchToTheme } from '../routes/_utils/themeEngine'
import { basename } from '../routes/_api/utils'
import { onUserIsLoggedOut } from '../routes/_actions/onUserIsLoggedOut'

window.__themeColors = process.env.THEME_COLORS

const safeParse = str => (typeof str === 'undefined' || str === 'undefined') ? undefined : JSON.parse(str)
const hasLocalStorage = testHasLocalStorageOnce()
const currentInstance = hasLocalStorage && safeParse(localStorage.store_currentInstance)

if (currentInstance) {
  // Do prefetch if we're logged in, so we can connect faster to the other origin.
  // Note that /api/v1/instance is basically the only URL that doesn't require credentials,
  // which is why we can do this. Also we do end up calling this on loading the home page,
  // so it's not a wasted request.
  let link = document.createElement('link')
  link.setAttribute('rel', 'prefetch')
  link.setAttribute('href', `${basename(currentInstance)}/api/v1/instance`)
  link.setAttribute('crossorigin', 'anonymous')
  document.head.appendChild(link)
}

let theme = (currentInstance &&
  localStorage.store_instanceThemes &&
  safeParse(localStorage.store_instanceThemes)[safeParse(localStorage.store_currentInstance)]) ||
  DEFAULT_THEME
if (theme !== DEFAULT_LIGHT_THEME) {
  // switch theme ASAP to minimize flash of default theme
  switchToTheme(theme)
}

if (!hasLocalStorage || !currentInstance) {
  // if not logged in, show all these 'hidden-from-ssr' elements
  onUserIsLoggedOut()
}

if (hasLocalStorage && localStorage.store_disableCustomScrollbars === 'true') {
  // if user has disabled custom scrollbars, remove this style
  let theScrollbarStyle = document.getElementById('theScrollbarStyle')
  theScrollbarStyle.setAttribute('media', 'only x') // disables the style
}

// hack to make the scrollbars rounded only on macOS
if (/mac/i.test(navigator.platform)) {
  document.documentElement.style.setProperty('--scrollbar-border-radius', '50px')
}

// TODO: remove this hack when Safari works with cross-origin window.open()
// in a PWA: https://github.com/nolanlawson/pinafore/issues/45
if (/iP(?:hone|ad|od)/.test(navigator.userAgent)) {
  document.head.removeChild(document.getElementById('theManifest'))
}
