import { setFavicon } from '../../_utils/setFavicon'
import { runMediumPriorityTask } from '../../_utils/runMediumPriorityTask'
import { store } from '../store'
import { ASSET_VERSION } from '../../_static/assets'

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
      setFavicon(`/${ASSET_VERSION}/favicon-${hasNotifications ? 'alert' : ''}.png`)
      currentFaviconHasNotifications = !currentFaviconHasNotifications
    })
  })
}
