import { get, post, DEFAULT_TIMEOUT, WRITE_TIMEOUT } from '../_utils/ajax'
import { auth, basename } from './utils'

export async function getPoll (instanceName, accessToken, pollId) {
  const url = `${basename(instanceName)}/api/v1/polls/${pollId}`
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}

export async function voteOnPoll (instanceName, accessToken, pollId, choices) {
  const url = `${basename(instanceName)}/api/v1/polls/${pollId}/votes`
  return post(url, { choices }, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
