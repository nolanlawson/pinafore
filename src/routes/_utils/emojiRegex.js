import emojiRegex from 'emoji-regex/text'
import { thunk } from './thunk'

export const getEmojiRegex = thunk(emojiRegex)
