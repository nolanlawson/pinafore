import { isEmojiSupported, setCacheHandler } from 'is-emoji-supported'
import { QuickLRU } from '../_thirdparty/quick-lru/quick-lru'

// avoid recomputing emoji support over and over again
// use our own LRU since the built-in one grows forever, which is a small memory leak, but still
setCacheHandler(new QuickLRU({ maxSize: 500 }))

export const testEmojiSupported = isEmojiSupported
