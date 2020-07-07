import { removeEmoji } from './removeEmoji'

export function createAutosuggestAccessibleLabel (
  autosuggestType, $omitEmojiInDisplayNames,
  selectedIndex, searchResults) {
  const selected = searchResults[selectedIndex]
  let label
  if (autosuggestType === 'emoji') {
    label = selected.name || [selected.unicode].concat(selected.shortcodes).join(', ')
  } else if (autosuggestType === 'hashtag') {
    label = `#${selected.name}`
  } else { // account
    let displayName = selected.display_name || selected.username
    const emojis = selected.emojis || []
    displayName = $omitEmojiInDisplayNames
      ? removeEmoji(displayName, emojis) || displayName
      : displayName
    label = `${displayName} @${selected.acct}`
  }
  return label
}
