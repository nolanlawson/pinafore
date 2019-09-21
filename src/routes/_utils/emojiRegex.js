import emojiRegex from 'emoji-regex/es2015/text'
import { thunk } from './thunk'

export const getEmojiRegex = thunk(emojiRegex)
