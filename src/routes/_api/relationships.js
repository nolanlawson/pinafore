import { basename, auth } from './utils.js'
import { get, paramsString, DEFAULT_TIMEOUT } from '../_utils/ajax.js'

export async function getRelationship (instanceName, accessToken, accountId) {
  let url = `${basename(instanceName)}/api/v1/accounts/relationships?${paramsString({ id: accountId })}`
  let res = await get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
  return res[0]
}
