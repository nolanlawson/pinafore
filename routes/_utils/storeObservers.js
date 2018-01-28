import { updateVerifyCredentialsForInstance } from '../settings/instances/_actions/[instanceName]'

export function storeObservers(store) {
  store.observe('currentInstance', (currentInstance) => {
    updateVerifyCredentialsForInstance(currentInstance)
  })
}