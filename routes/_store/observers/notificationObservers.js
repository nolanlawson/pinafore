import { setFavicon } from '../../_utils/setFavicon'
import { scheduleIdleTask } from '../../_utils/scheduleIdleTask'

let currentFaviconHasNotifications = false

export function notificationObservers (store) {
  store.observe('hasNotifications', hasNotifications => {
    if (!process.browser) {
      return
    }
    scheduleIdleTask(() => {
      if (currentFaviconHasNotifications === hasNotifications) {
        return
      }
      setFavicon(hasNotifications ? '/favicon-alert.png' : '/favicon.png')
      currentFaviconHasNotifications = !currentFaviconHasNotifications
    })
  })
}
