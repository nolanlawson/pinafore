import { CHAR_LIMIT } from '../_static/statuses'

export function statusComputations (store) {
  store.compute('rawInputTextInComposeLength',
    ['rawInputTextInCompose'],
    (rawInputTextInCompose) => rawInputTextInCompose.length
  )

  store.compute('rawInputTextInComposeOverLimit',
    ['rawInputTextInComposeLength'],
    (rawInputTextInComposeLength) => rawInputTextInComposeLength > CHAR_LIMIT
  )
}
