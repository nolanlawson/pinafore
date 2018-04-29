import { auth, basename } from './utils'
import { postWithTimeout } from '../_utils/ajax'

export async function postStatus (instanceName, accessToken, text, inReplyToId, mediaIds,
  sensitive, spoilerText, visibility) {
  let url = `${basename(instanceName)}/api/v1/statuses`

  let body = {
    status: text,
    in_reply_to_id: inReplyToId,
    media_ids: mediaIds,
    sensitive: sensitive,
    spoiler_text: spoilerText,
    visibility: visibility
  }

  for (let key of Object.keys(body)) {
    let value = body[key]
    if (!value || (Array.isArray(value) && !value.length)) {
      delete body[key]
    }
  }

  return postWithTimeout(url, body, auth(accessToken))
}
