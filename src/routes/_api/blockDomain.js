import { post, WRITE_TIMEOUT, paramsString, del } from '../_utils/ajax'
import { auth, basename } from './utils'

export async function blockDomain (instanceName, accessToken, domain) {
  const url = `${basename(instanceName)}/api/v1/domain_blocks?${paramsString({ domain })}`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export async function unblockDomain (instanceName, accessToken, domain) {
  const url = `${basename(instanceName)}/api/v1/domain_blocks?${paramsString({ domain })}`
  return del(url, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
