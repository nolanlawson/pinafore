import { store } from '../store'

export function badgeObservers () {
  if (!process.browser) {
    return
  }
  if (typeof navigator.setAppBadge !== 'function' || typeof navigator.clearAppBadge !== 'function') {
    return
  }
  store.observe('badgeNumber', badgeNumber => {
    if (badgeNumber) {
      navigator.setAppBadge(badgeNumber)
    } else {
      navigator.clearAppBadge()
    }
  })
}
