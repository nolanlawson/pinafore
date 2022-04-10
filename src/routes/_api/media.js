import { auth, basename } from './utils.js'
import { post, put, MEDIA_WRITE_TIMEOUT, WRITE_TIMEOUT } from '../_utils/ajax.js'

async function doUploadMedia (version, instanceName, accessToken, file, description) {
  const formData = new FormData()
  formData.append('file', file)
  if (description) {
    formData.append('description', description)
  }
  const url = `${basename(instanceName)}/api/${version}/media`
  return post(url, formData, auth(accessToken), { timeout: MEDIA_WRITE_TIMEOUT })
}

async function doPutMediaMetadata (version, instanceName, accessToken, mediaId, description, focus) {
  const url = `${basename(instanceName)}/api/${version}/media/${mediaId}`
  return put(url, { description, focus: (focus && focus.join(',')) }, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export async function uploadMedia (instanceName, accessToken, file, description) {
  try {
    return (await doUploadMedia('v2', instanceName, accessToken, file, description))
  } catch (err) {
    if (err && err.status === 404) { // fall back to old v1 API
      return doUploadMedia('v1', instanceName, accessToken, file, description)
    } else {
      throw err
    }
  }
}

export async function putMediaMetadata (instanceName, accessToken, mediaId, description, focus) {
  try {
    return (await doPutMediaMetadata('v2', instanceName, accessToken, mediaId, description, focus))
  } catch (err) {
    if (err && err.status === 404) { // fall back to old v1 API
      return doPutMediaMetadata('v1', instanceName, accessToken, mediaId, description, focus)
    } else {
      throw err
    }
  }
}
