import { removeEmoji } from '../_utils/removeEmoji.js'

export function getAccountAccessibleName (account, omitEmojiInDisplayNames) {
  const emojis = account.emojis
  let displayName = account.display_name || account.username
  if (omitEmojiInDisplayNames) {
    displayName = removeEmoji(displayName, emojis) || displayName
  }
  return displayName
}
