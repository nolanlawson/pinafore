import QuickLRU from 'quick-lru'

const CACHE_SIZE = 10

export const modalDataCache = new QuickLRU({maxSize: CACHE_SIZE})
export const modalCache = new QuickLRU({maxSize: CACHE_SIZE})

export function createModalId () {
  return '' + Date.now() // random uuid
}
