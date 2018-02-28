import { CHAR_LIMIT } from '../_static/statuses'
import { measureText } from '../_utils/measureText'

export function statusComputations (store) {
  store.compute('rawComposeTextLength',
    ['rawComposeText'],
    (rawComposeText) => measureText(rawComposeText)
  )

  store.compute('rawComposeTextOverLimit',
    ['rawComposeTextLength'],
    (rawComposeTextLength) => rawComposeTextLength > CHAR_LIMIT
  )
}
