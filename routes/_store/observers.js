import { updateVerifyCredentialsForInstance } from '../settings/instances/_actions/[instanceName]'
import { fetchLists } from '../community/_actions/community'

export function observers(store) {
  store.observe('currentInstance', (currentInstance) => {
    if (currentInstance) {
      updateVerifyCredentialsForInstance(currentInstance)
      fetchLists()
    }
  })
}