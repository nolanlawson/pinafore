import emojiRegex from 'emoji-regex/es2015/text.js'
import { thunk } from './thunk.js'

export const getEmojiRegex = thunk(emojiRegex)
