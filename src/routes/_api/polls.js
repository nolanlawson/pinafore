import { get, DEFAULT_TIMEOUT } from '../_utils/ajax'
import { auth, basename } from './utils'

export async function getPoll (instanceName, accessToken, pollId) {
  let url = `${basename(instanceName)}/api/v1/polls/${pollId}`
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}
