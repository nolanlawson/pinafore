import { cacheFirstUpdateAfter } from '../_utils/sync'
import {
  getCustomEmoji as getCustomEmojiFromDatabase,
  setCustomEmoji as setCustomEmojiInDatabase
} from '../_database/meta'
import { getCustomEmoji } from '../_api/emoji'
import { store } from '../_store/store'

export async function updateCustomEmojiForInstance (instanceName) {
  await cacheFirstUpdateAfter(
    () => getCustomEmoji(instanceName),
    () => getCustomEmojiFromDatabase(instanceName),
    emoji => setCustomEmojiInDatabase(instanceName, emoji),
    emoji => {
      let customEmoji = store.get('customEmoji')
      customEmoji[instanceName] = emoji
      store.set({customEmoji: customEmoji})
    }
  )
}

export function insertEmoji (realm, emoji) {
  let idx = store.get('composeSelectionStart') || 0
  let oldText = store.getComposeData(realm, 'text') || ''
  let pre = oldText.substring(0, idx)
  let post = oldText.substring(idx)
  let newText = `${pre}:${emoji.shortcode}: ${post}`
  store.setComposeData(realm, {text: newText})
}

export function insertEmojiAtPosition (realm, emoji, startIndex, endIndex) {
  let oldText = store.getComposeData(realm, 'text') || ''
  let pre = oldText.substring(0, startIndex)
  let post = oldText.substring(endIndex)
  let newText = `${pre}:${emoji.shortcode}: ${post}`
  store.setComposeData(realm, {text: newText})
}

export async function clickSelectedAutosuggestionEmoji (realm) {
  let selectionStart = store.get('composeSelectionStart')
  let searchText = store.get('composeAutosuggestionSearchText')
  let selection = store.get('composeAutosuggestionSelected') || 0
  let emoji = store.get('composeAutosuggestionSearchResults')[selection]
  let startIndex = selectionStart - searchText.length
  let endIndex = selectionStart
  await insertEmojiAtPosition(realm, emoji, startIndex, endIndex)
}
