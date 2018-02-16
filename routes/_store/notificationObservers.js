import { setFavicon } from '../_utils/setFavicon'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'

export function notificationObservers (store) {
  store.observe('hasNotifications', hasNotifications => {
    if (!process.browser) {
      return
    }
    scheduleIdleTask(() => {
      if (hasNotifications) {
        setFavicon('/favicon-alert.png')
      } else {
        setFavicon('/favicon.png')
      }
    })
  })
}