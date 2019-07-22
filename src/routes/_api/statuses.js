import { auth, basename } from './utils'
import { DEFAULT_TIMEOUT, get, post, WRITE_TIMEOUT } from '../_utils/ajax'

export async function postStatus (instanceName, accessToken, text, inReplyToId, mediaIds,
  sensitive, spoilerText, visibility, poll) {
  const url = `${basename(instanceName)}/api/v1/statuses`

  const body = {
    status: text,
    in_reply_to_id: inReplyToId,
    media_ids: mediaIds,
    sensitive: sensitive,
    spoiler_text: spoilerText,
    visibility: visibility,
    poll: poll
  }

  for (const key of Object.keys(body)) {
    const value = body[key]
    // remove any unnecessary fields, except 'status' which must at least be an empty string
    if (key !== 'status' && (!value || (Array.isArray(value) && !value.length))) {
      delete body[key]
    }
  }

  return post(url, body, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export async function getStatusContext (instanceName, accessToken, statusId) {
  const url = `${basename(instanceName)}/api/v1/statuses/${statusId}/context`
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}

export async function getStatus (instanceName, accessToken, statusId) {
  const url = `${basename(instanceName)}/api/v1/statuses/${statusId}`
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}
