import { setFavicon } from '../../_utils/setFavicon'
import { runMediumPriorityTask } from '../../_utils/runMediumPriorityTask'
import { store } from '../store'

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
      setFavicon(hasNotifications ? '/immutable/favicon-alert-5b434045.png' : '/immutable/favicon-7c042bc4.png')
      currentFaviconHasNotifications = !currentFaviconHasNotifications
    })
  })
}
