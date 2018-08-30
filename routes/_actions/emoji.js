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
      let { customEmoji } = store.get()
      customEmoji[instanceName] = emoji
      store.set({ customEmoji: customEmoji })
    }
  )
}

export function insertEmoji (realm, emoji) {
  let { composeSelectionStart } = store.get()
  let idx = composeSelectionStart || 0
  let oldText = store.getComposeData(realm, 'text') || ''
  let pre = oldText.substring(0, idx)
  let post = oldText.substring(idx)
  let newText = `${pre}:${emoji.shortcode}: ${post}`
  store.setComposeData(realm, { text: newText })
}
