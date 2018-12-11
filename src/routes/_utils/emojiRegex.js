import emojiRegex from 'emoji-regex/es2015/text'

let theEmojiRegex

export function getEmojiRegex () {
  theEmojiRegex = theEmojiRegex || emojiRegex() // only init when needed, then cache
  return theEmojiRegex
}
