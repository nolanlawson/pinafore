import { getEmojiRegex } from './emojiRegex'

// \ufe0f is a variation selector, which seems to appear for some reason in e.g. ™
const NON_EMOJI_REGEX = /^(?:[0-9#*]|™|®|\ufe0f)+$/

// replace emoji in HTML with something else, safely skipping HTML tags
export function replaceEmoji (string, replacer) {
  let output = ''
  let leftAngleBracketIdx = string.indexOf('<')
  let currentIdx = 0
  const emojiRegex = getEmojiRegex()

  function safeReplacer (substring) {
    // emoji regex matches digits and pound sign https://git.io/fpl6J
    if (substring.match(NON_EMOJI_REGEX)) {
      return substring
    }
    return replacer(substring)
  }

  while (leftAngleBracketIdx !== -1) {
    const substring = string.substring(currentIdx, leftAngleBracketIdx)

    output += substring.replace(emojiRegex, safeReplacer)

    const rightAngleBracketIdx = string.indexOf('>', leftAngleBracketIdx + 1)
    if (rightAngleBracketIdx === -1) { // broken HTML, abort
      output += string.substring(leftAngleBracketIdx, string.length)
      return output
    }
    output += string.substring(leftAngleBracketIdx, rightAngleBracketIdx) + '>'
    currentIdx = rightAngleBracketIdx + 1
    leftAngleBracketIdx = string.indexOf('<', currentIdx)
  }

  output += string.substring(currentIdx, string.length).replace(emojiRegex, safeReplacer)

  return output
}
