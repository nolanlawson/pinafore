import emojiRegex from 'emoji-regex'
import { thunk } from './thunk.js'

export const getEmojiRegex = thunk(emojiRegex)
