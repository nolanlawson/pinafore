import { removeEmoji } from './removeEmoji'

export function createAutosuggestAccessibleLabel (
  autosuggestType, $omitEmojiInDisplayNames,
  selectedIndex, searchResults) {
  let selected = searchResults[selectedIndex]
  let label
  if (autosuggestType === 'emoji') {
    label = `${selected.shortcode}`
  } else { // account
    let displayName = selected.display_name || selected.username
    let emojis = selected.emojis || []
    displayName = $omitEmojiInDisplayNames
      ? removeEmoji(displayName, emojis) || displayName
      : displayName
    label = `${displayName} @${selected.acct}`
  }
  return `${label} (${selectedIndex + 1} of ${searchResults.length}). ` +
    `Press up and down arrows to review and enter to select.`
}
