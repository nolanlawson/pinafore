import { auth, basename } from './utils'
import { post, put, MEDIA_WRITE_TIMEOUT, WRITE_TIMEOUT } from '../_utils/ajax'

export async function uploadMedia (instanceName, accessToken, file, description) {
  const formData = new FormData()
  formData.append('file', file)
  if (description) {
    formData.append('description', description)
  }
  const url = `${basename(instanceName)}/api/v1/media`
  return post(url, formData, auth(accessToken), { timeout: MEDIA_WRITE_TIMEOUT })
}

export async function putMediaMetadata (instanceName, accessToken, mediaId, description, focus) {
  const url = `${basename(instanceName)}/api/v1/media/${mediaId}`
  return put(url, { description, focus: (focus && focus.join(',')) }, auth(accessToken), { timeout: WRITE_TIMEOUT })
}
