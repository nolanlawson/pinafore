import { VirtualListStore } from './virtualListStore'

const virtualStoreCache = {}

if (process.browser && process.env.NODE_ENV !== 'production') {
  window.virtualStoreCache = virtualStoreCache
}

export function getVirtualStore(storeKey) {
  let cached = virtualStoreCache[storeKey]
  if (!cached) {
    cached = virtualStoreCache[storeKey] = new VirtualListStore()
  }
  return cached
}