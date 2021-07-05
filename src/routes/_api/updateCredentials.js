import { WRITE_TIMEOUT, patch } from '../_utils/ajax.js'
import { auth, basename } from './utils.js'

export async function updateCredentials (instanceName, accessToken, accountData) {
  const url = `${basename(instanceName)}/api/v1/accounts/update_credentials`
  return patch(url, accountData, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
