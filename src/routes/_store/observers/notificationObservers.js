import { setFavicon } from '../../_utils/setFavicon.js'
import { runMediumPriorityTask } from '../../_utils/runMediumPriorityTask.js'
import { store } from '../store.js'

let currentFaviconHasNotifications = false

export function notificationObservers () {
  store.observe('hasNotifications', hasNotifications => {
    if (!process.browser) {
      return
    }
    runMediumPriorityTask(() => {
      if (currentFaviconHasNotifications === hasNotifications) {
        return
      }
      setFavicon(hasNotifications ? '/favicon-alert.png' : '/favicon.png')
      currentFaviconHasNotifications = !currentFaviconHasNotifications
    })
  })
}
