import { get } from '../_utils/ajax'
import { basename } from './utils'

export function getInstanceInfo(instanceName) {
  let url = `${basename(instanceName)}/api/v1/instance`
  return get(url)
}