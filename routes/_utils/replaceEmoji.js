import { getEmojiRegex } from './emojiRegex'

// replace emoji in HTML with something else, safely skipping HTML tags
export function replaceEmoji (string, replacer) {
  let output = ''
  let leftAngleBracketIdx = string.indexOf('<')
  let currentIdx = 0
  let emojiRegex = getEmojiRegex()

  function safeReplacer (substring) {
    if (substring.match(/^[0-9]+$/)) { // for some reason, emoji-regex matches digits
      return substring
    }
    return replacer(substring)
  }

  while (leftAngleBracketIdx !== -1) {
    let substring = string.substring(currentIdx, leftAngleBracketIdx)

    output += substring.replace(emojiRegex, safeReplacer)

    let rightAngleBracketIdx = string.indexOf('>', leftAngleBracketIdx + 1)
    output += string.substring(leftAngleBracketIdx, rightAngleBracketIdx)
    currentIdx = rightAngleBracketIdx + 1
    leftAngleBracketIdx = string.indexOf('<', currentIdx)
  }

  output += string.substring(currentIdx, string.length).replace(emojiRegex, safeReplacer)

  return output
}
