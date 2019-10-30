// Makes it so the left and right arrows change focus, ala Tab/Shift+Tab. This is mostly designed
// for KaiOS devices.

import { importArrowKeyNavigation } from '../../_utils/asyncModules/importArrowKeyNavigation.js'

let arrowKeyNav

export function leftRightFocusObservers (store) {
  if (!process.browser) {
    return
  }

  store.observe('leftRightChangesFocus', async leftRightChangesFocus => {
    if (leftRightChangesFocus) {
      if (!arrowKeyNav) {
        arrowKeyNav = await importArrowKeyNavigation()
      }
      arrowKeyNav.setFocusTrapTest(element => element.classList.contains('modal-dialog'))
      arrowKeyNav.register()
    } else if (arrowKeyNav) {
      arrowKeyNav.unregister()
    }
  })
}
