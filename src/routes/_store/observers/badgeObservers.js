import { store } from '../store'

export function badgeObservers () {
  if (!process.browser) {
    return
  }
  if (!('setAppBadge' in navigator)) {
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
