import { auth, basename } from './utils'
import { post, put, MEDIA_WRITE_TIMEOUT, WRITE_TIMEOUT } from '../_utils/ajax'

export async function uploadMedia (instanceName, accessToken, file, description) {
  let formData = new FormData()
  formData.append('file', file)
  if (description) {
    formData.append('description', description)
  }
  let url = `${basename(instanceName)}/api/v1/media`
  return post(url, formData, auth(accessToken), { timeout: MEDIA_WRITE_TIMEOUT })
}

export async function putMediaDescription (instanceName, accessToken, mediaId, description) {
  let url = `${basename(instanceName)}/api/v1/media/${mediaId}`
  return put(url, { description }, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
