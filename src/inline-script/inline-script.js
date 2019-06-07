
// For perf reasons, this script is run inline to quickly set certain styles.
// To allow CSP to work correctly, we also calculate a sha256 hash during
// the build process and write it to checksum.js.

import { INLINE_THEME, DEFAULT_THEME, switchToTheme } from '../routes/_utils/themeEngine'
import { basename } from '../routes/_api/utils'
import { onUserIsLoggedOut } from '../routes/_actions/onUserIsLoggedOut'
import { storeLite } from '../routes/_store/storeLite'

window.__themeColors = process.env.THEME_COLORS

const {
  currentInstance,
  instanceThemes,
  disableCustomScrollbars,
  enableGrayscale,
  pushSubscription,
  loggedInInstancesInOrder
} = storeLite.get()

const theme = (instanceThemes && instanceThemes[currentInstance]) || DEFAULT_THEME

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

if (theme !== INLINE_THEME) {
  // switch theme ASAP to minimize flash of default theme
  switchToTheme(theme, enableGrayscale)
}

if (enableGrayscale) {
  document.getElementById('theGrayscaleStyle')
    .setAttribute('media', 'all') // enables the style
}

if (!currentInstance) {
  // if not logged in, show all these 'hidden-from-ssr' elements
  onUserIsLoggedOut()
}

if (disableCustomScrollbars) {
  document.getElementById('theScrollbarStyle')
    .setAttribute('media', 'only x') // disables the style
}

// hack to make the scrollbars rounded only on macOS
if (/mac/i.test(navigator.platform)) {
  document.documentElement.style.setProperty('--scrollbar-border-radius', '50px')
}

// Versions of iOS Safari before iOS 12.2 do not work properly as a PWA
// for cross-origin authentication: https://github.com/nolanlawson/pinafore/issues/45
// Here we sniff for iOS <12.2 by checking for the existence of a native IntersectionObserver
// function, which was added in 12.2.
if (/iP(?:hone|ad|od)/.test(navigator.userAgent) &&
  !(typeof IntersectionObserver === 'function' &&
    IntersectionObserver.toString().includes('[native code]'))) {
  document.head.removeChild(document.getElementById('theManifest'))
}

if (pushSubscription) {
  // Fix a bug in Pinafore <=v1.9.0 if we only have one instance we're logged in to
  // (https://github.com/nolanlawson/pinafore/issues/1274)
  if (loggedInInstancesInOrder && loggedInInstancesInOrder.length === 1) {
    storeLite.set({
      pushSubscriptions: {
        [currentInstance]: pushSubscription
      }
    })
  }
  storeLite.set({
    pushSubscription: undefined
  })
}
