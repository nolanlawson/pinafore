import { updateVerifyCredentialsForInstance } from '../settings/instances/_actions/[instanceName]'

export function observers(store) {
  store.observe('currentInstance', (currentInstance) => {
    if (currentInstance) {
      updateVerifyCredentialsForInstance(currentInstance)
    }
  })
}