import { updateInstanceInfo, updateVerifyCredentialsForInstance } from '../_actions/instances'
import { updateLists } from '../_actions/lists'

export function instanceObservers (store) {
  store.observe('currentInstance', (currentInstance) => {
    if (!currentInstance) {
      return
    }
    updateVerifyCredentialsForInstance(currentInstance)
    updateInstanceInfo(currentInstance)
    updateLists()
  })
}