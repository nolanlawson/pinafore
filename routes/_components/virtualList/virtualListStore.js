import { Store } from 'svelte/store.js'
import { mark, stop } from '../../_utils/marks'

const VIEWPORT_RENDER_FACTOR = 4

class VirtualListStore extends Store {
  constructor(state) {
    super(state)
    this._batches = {}
  }

  batchUpdate(key, subKey, value) {
    let batch = this._batches[key]
    if (!batch) {
      batch = this._batches[key] = {}
    }
    batch[subKey] = value

    requestAnimationFrame(() => {
      let batch = this._batches[key]
      if (!batch) {
        return
      }
      let updatedKeys = Object.keys(batch)
      if (!updatedKeys.length) {
        return
      }
      mark('batchUpdate()')
      let obj = this.get(key)
      for (let otherKey of updatedKeys) {
        obj[otherKey] = batch[otherKey]
      }
      delete this._batches[key]
      let toSet = {}
      toSet[key] = obj
      this.set(toSet)
      stop('batchUpdate()')
    })
  }

  setForRealm(obj) {
    let realmName = this.get('currentRealm')
    let realms = this.get('realms') || {}
    realms[realmName] = Object.assign(realms[realmName] || {}, obj)
    this.set({realms: realms})
  }
}

const virtualListStore = new VirtualListStore({
  realms: {},
  currentRealm: null,
  itemHeights: {},
  footerHeight: 0
})

virtualListStore.compute('items', ['currentRealm', 'realms'], (currentRealm, realms) => {
  return realms[currentRealm] && realms[currentRealm].items || []
})

virtualListStore.compute('showFooter', ['currentRealm', 'realms'], (currentRealm, realms) => {
  return realms[currentRealm] && realms[currentRealm].showFooter
})

virtualListStore.compute('scrollTop', ['currentRealm', 'realms'], (currentRealm, realms) => {
  return realms[currentRealm] && realms[currentRealm].scrollTop || 0
})

virtualListStore.compute('scrollHeight', ['currentRealm', 'realms'], (currentRealm, realms) => {
  return realms[currentRealm] && realms[currentRealm].scrollHeight || 0
})

virtualListStore.compute('offsetHeight', ['currentRealm', 'realms'], (currentRealm, realms) => {
  return realms[currentRealm] && realms[currentRealm].offsetHeight || 0
})

virtualListStore.compute('scrollToItem', ['currentRealm', 'realms'], (currentRealm, realms) => {
  return realms[currentRealm] && realms[currentRealm].scrollToItem
})

virtualListStore.compute('visibleItems',
    ['items', 'scrollTop', 'itemHeights', 'offsetHeight', 'itemsLeftToCalculateHeight'],
    (items, scrollTop, itemHeights, offsetHeight, itemsLeftToCalculateHeight) => {
  mark('compute visibleItems')
  let renderBuffer = VIEWPORT_RENDER_FACTOR * offsetHeight
  let visibleItems = []
  let totalOffset = 0
  let len = items.length
  let i = -1
  while (++i < len) {
    let key = items[i]
    let height = itemHeights[key] || 0
    let currentOffset = totalOffset
    totalOffset += height
    if (!itemsLeftToCalculateHeight) {
      if (currentOffset < scrollTop) { // below viewport
        if (scrollTop - renderBuffer > currentOffset) {
          continue // below the area we want to render
        }
      } else { // above or inside viewport
        if (currentOffset > (scrollTop + height + renderBuffer)) {
          break // above the area we want to render
        }
      }
    }
    visibleItems.push({
      offset: currentOffset,
      key: key,
      index: i
    })
  }
  stop('compute visibleItems')
  return visibleItems
})

virtualListStore.compute('heightWithoutFooter',
    ['items', 'itemHeights'],
    (items, itemHeights) => {
  let sum = 0
  let i = -1
  let len = items.length
  while (++i < len) {
    sum += itemHeights[items[i]] || 0
  }
  return sum
})


virtualListStore.compute('height',
    ['heightWithoutFooter', 'showFooter', 'footerHeight'],
    (heightWithoutFooter, showFooter, footerHeight) => {
  return showFooter ? (heightWithoutFooter + footerHeight) : heightWithoutFooter
})

virtualListStore.compute('numItems', ['items'], (items) => items.length)

virtualListStore.compute('allVisibleItemsHaveHeight',
    ['visibleItems', 'itemHeights'],
    (visibleItems, itemHeights) => {
  if (!visibleItems.length) {
    return false
  }
  for (let visibleItem of visibleItems) {
    if (!itemHeights[visibleItem.key]) {
      return false
    }
  }
  return true
})

// if we need to initialize the scroll at a particular item, then
// we effectively have to calculate all visible item heights
// TODO: technically not, we only need to calculate the items above it... or even estimate
virtualListStore.compute('mustCalculateAllItemHeights',
    ['scrollToItem'],
    (scrollToItem) => !!scrollToItem
  )

virtualListStore.compute('itemsLeftToCalculateHeight',
    ['mustCalculateAllItemHeights', 'itemHeights', 'items'],
    (mustCalculateAllItemHeights, itemHeights, items) => {
  if (!mustCalculateAllItemHeights) {
    return false
  }
  for (let item of items) {
    if (!itemHeights[item]) {
      return true
    }
  }
  return false
})

virtualListStore.compute('scrollToItemOffset',
    ['mustCalculateAllItemHeights', 'itemsLeftToCalculateHeight', 'scrollToItem', 'items', 'itemHeights', 'containerTop', 'virtualListTop'],
    (mustCalculateAllItemHeights, itemsLeftToCalculateHeight, scrollToItem, items, itemHeights, containerTop, virtualListTop) => {
  if (!mustCalculateAllItemHeights || itemsLeftToCalculateHeight || !containerTop || !virtualListTop) {
    return null
  }
  let offset = 0
  for (let item of items) {
    if (item === scrollToItem) {
      break
    }
    offset += itemHeights[item]
  }
  return offset + (virtualListTop - containerTop) // have to offset difference between container and virtual list
})


if (process.browser && process.env.NODE_ENV !== 'production') {
  window.virtualListStore = virtualListStore
}

export {
  virtualListStore
}