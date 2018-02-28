import { CHAR_LIMIT } from '../_static/statuses'

export function statusComputations (store) {
  store.compute('rawComposeTextLength',
    ['rawComposeText'],
    (rawComposeText) => rawComposeText.length
  )

  store.compute('rawComposeTextOverLimit',
    ['rawComposeTextLength'],
    (rawComposeTextLength) => rawComposeTextLength > CHAR_LIMIT
  )
}
