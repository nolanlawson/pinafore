import {
  cacheFirstUpdateAfter,
  cacheFirstUpdateOnlyIfNotInCache
} from '../_utils/sync'
import { database } from '../_database/database'
import { getCustomEmoji } from '../_api/emoji'
import { store } from '../_store/store'

async function syncEmojiForInstance (instanceName, syncMethod) {
  await syncMethod(
    () => getCustomEmoji(instanceName),
    () => database.getCustomEmoji(instanceName),
    emoji => database.setCustomEmoji(instanceName, emoji),
    emoji => {
      const { customEmoji } = store.get()
      customEmoji[instanceName] = emoji
      store.set({ customEmoji: customEmoji })
    }
  )
}

export async function updateCustomEmojiForInstance (instanceName) {
  await syncEmojiForInstance(instanceName, cacheFirstUpdateAfter)
}

export async function setupCustomEmojiForInstance (instanceName) {
  await syncEmojiForInstance(instanceName, cacheFirstUpdateOnlyIfNotInCache)
}

export function insertEmoji (realm, emoji) {
  const emojiText = emoji.custom ? emoji.colons : emoji.native
  const { composeSelectionStart } = store.get()
  const idx = composeSelectionStart || 0
  const oldText = store.getComposeData(realm, 'text') || ''
  const pre = oldText.substring(0, idx)
  const post = oldText.substring(idx)
  const newText = `${pre}${emojiText} ${post}`
  store.setComposeData(realm, { text: newText })
}
