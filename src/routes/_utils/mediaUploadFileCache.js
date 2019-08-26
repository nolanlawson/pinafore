// keep a cache of files for the most recent uploads to avoid
// re-downloading them for OCR

import { QuickLRU } from '../_thirdparty/quick-lru/quick-lru'

export const mediaUploadFileCache = new QuickLRU({ maxSize: 4 })
