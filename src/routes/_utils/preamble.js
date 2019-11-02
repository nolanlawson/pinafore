// Code that is designed to run before just about everything in the main JavaScript bundle
import { INLINE_THEME, DEFAULT_THEME, switchToTheme } from './themeEngine'
import { basename } from '../_api/utils'
import { onUserIsLoggedOut } from '../_actions/onUserIsLoggedOut'
import { store } from '../_store/store'
import { isIOSPre12Point2 } from './userAgent/isIOSPre12Point2'
import { isMac } from './userAgent/isMac'

const {
  currentInstance,
  instanceThemes,
  disableCustomScrollbars,
  enableGrayscale,
  pushSubscription,
  loggedInInstancesInOrder
} = store.get()

const theme = (instanceThemes && instanceThemes[currentInstance]) || DEFAULT_THEME

if (currentInstance) {
  // Do preconnect if we're logged in, so we can connect faster to the other origin.
  const link = document.createElement('link')
  link.setAttribute('rel', 'preconnect')
  link.setAttribute('href', basename(currentInstance))
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
if (isMac()) {
  document.documentElement.style.setProperty('--scrollbar-border-radius', '50px')
}

// Versions of iOS Safari before iOS 12.2 do not work properly as a PWA
// for cross-origin authentication: https://github.com/nolanlawson/pinafore/issues/45
// Here we sniff for iOS <12.2 by checking for the existence of a native IntersectionObserver
// function, which was added in 12.2.
if (isIOSPre12Point2()) {
  document.head.removeChild(document.getElementById('theManifest'))
}

if (pushSubscription) {
  // Fix a bug in Pinafore <=v1.9.0 if we only have one instance we're logged in to
  // (https://github.com/nolanlawson/pinafore/issues/1274)
  if (loggedInInstancesInOrder && loggedInInstancesInOrder.length === 1) {
    store.set({
      pushSubscriptions: {
        [currentInstance]: pushSubscription
      }
    })
  }
  store.set({
    pushSubscription: null
  })
}
