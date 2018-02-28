import { cacheFirstUpdateAfter } from '../_utils/sync'
import { database } from '../_database/database'
import { getCustomEmoji } from '../_api/emoji'
import { store } from '../_store/store'

export async function updateCustomEmojiForInstance (instanceName) {
  await cacheFirstUpdateAfter(
    () => getCustomEmoji(instanceName),
    () => database.getCustomEmoji(instanceName),
    emoji => database.setCustomEmoji(instanceName, emoji),
    emoji => {
      let customEmoji = store.get('customEmoji')
      customEmoji[instanceName] = emoji
      store.set({customEmoji: customEmoji})
    }
  )
}

export function insertEmoji (emoji) {
  store.set({emojiToInsert: emoji})
}
