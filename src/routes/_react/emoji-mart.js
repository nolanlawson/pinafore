// I wrap the emoji-mart React code itself here, so that we don't need to pass in a huge "data"
// object via a JSON-stringified custom element attribute.

import data from 'emoji-mart/data/messenger.json'
import NimblePicker from 'emoji-mart/dist-es/components/picker/nimble-picker'
import React from 'react'
import { emit } from '../_utils/eventBus'

function onEmojiSelected (emoji) {
  emit('emoji-selected', emoji)
}

export default props => React.createElement(NimblePicker, Object.assign({
  set: 'messenger',
  data,
  native: true,
  onSelect: onEmojiSelected
}, props))
