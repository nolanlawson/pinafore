import { updateVerifyCredentialsForInstance } from '../_actions/instances'
import { updateLists } from '../_actions/lists'

export function observers (store) {
  store.observe('currentInstance', (currentInstance) => {
    if (currentInstance) {
      updateVerifyCredentialsForInstance(currentInstance)
      updateLists()
    }
  })
}
