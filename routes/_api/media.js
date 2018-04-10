import { auth, basename } from './utils'
import { postWithTimeout, putWithTimeout } from '../_utils/ajax'

export async function uploadMedia (instanceName, accessToken, file, description) {
  let formData = new FormData()
  formData.append('file', file)
  if (description) {
    formData.append('description', description)
  }
  let url = `${basename(instanceName)}/api/v1/media`
  return postWithTimeout(url, formData, auth(accessToken))
}

export async function putMediaDescription (instanceName, accessToken, mediaId, description) {
  let url = `${basename(instanceName)}/api/v1/media/${mediaId}`
  return putWithTimeout(url, {description}, auth(accessToken))
}
