import { setFavicon } from '../../_utils/setFavicon'
import { scheduleIdleTask } from '../../_utils/scheduleIdleTask'

let currentFaviconHasNotifications = false

export function notificationObservers (store) {
  if (!process.browser) {
    return
  }
  store.on('state', ({changed, current}) => {
    if (!changed.hasNotifications) {
      return
    }
    let hasNotifications = current.hasNotifications
    scheduleIdleTask(() => {
      if (currentFaviconHasNotifications === hasNotifications) {
        return
      }
      setFavicon(hasNotifications ? '/favicon-alert.png' : '/favicon.png')
      currentFaviconHasNotifications = !currentFaviconHasNotifications
    })
  })
}
