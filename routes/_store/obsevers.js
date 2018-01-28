import { updateVerifyCredentialsForInstance } from '../settings/instances/_actions/[instanceName]'

export function observers(store) {
  store.observe('currentInstance', (currentInstance) => {
    updateVerifyCredentialsForInstance(currentInstance)
  })
}