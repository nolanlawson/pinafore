import { isEmojiSupported, setCacheHandler } from 'is-emoji-supported'
import { QuickLRU } from '../_thirdparty/quick-lru/quick-lru'

// avoid recomputing emoji support over and over again
setCacheHandler(new QuickLRU({ maxSize: 500 }))

export const testEmojiSupported = isEmojiSupported
