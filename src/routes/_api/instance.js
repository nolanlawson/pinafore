import { get, DEFAULT_TIMEOUT } from '../_utils/ajax.js'
import { basename } from './utils.js'

export function getInstanceInfo (instanceName) {
  const url = `${basename(instanceName)}/api/v1/instance`
  return get(url, null, { timeout: DEFAULT_TIMEOUT })
}
