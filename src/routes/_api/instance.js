import { get, DEFAULT_TIMEOUT } from '../_utils/ajax'
import { basename } from './utils'

export function getInstanceInfo (instanceName) {
  const url = `${basename(instanceName)}/api/v1/instance`
  return get(url, null, { timeout: DEFAULT_TIMEOUT })
}
