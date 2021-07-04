// via https://github.com/tootsuite/mastodon/blob/5d5c0f4/app/javascript/mastodon/features/compose/util/counter.js

import { urlRegex } from './urlRegex.js'
import { handleRegex } from './handleRegex.js'
import { mark, stop } from './marks.js'
import { length } from 'stringz'

const urlPlaceholder = 'xxxxxxxxxxxxxxxxxxxxxxx'

export function measureText (inputText) {
  if (!inputText) {
    return 0
  }
  mark('measureText()')
  const normalizedText = inputText
    .replace(urlRegex(), urlPlaceholder)
    .replace(handleRegex(), '$1@$3')
  const len = length(normalizedText)
  stop('measureText()')
  return len
}
