import { Store } from 'svelte/store.js'
import { mark, stop } from '../_utils/marks'

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
}

const virtualListStore = new VirtualListStore({
  items: [],
  itemHeights: {},
})

virtualListStore.compute('visibleItems',
    ['items', 'scrollTop', 'itemHeights', 'offsetHeight'],
    (items, scrollTop, itemHeights, offsetHeight) => {
  mark('compute visibleItems')
  let renderBuffer = VIEWPORT_RENDER_FACTOR * offsetHeight
  let visibleItems = []
  let totalOffset = 0
  let len = items.length
  let i = -1
  while (++i < len) {
    let { props, key } = items[i]
    let height = itemHeights[key] || 0
    let currentOffset = totalOffset
    totalOffset += height
    let isBelowViewport = (currentOffset < scrollTop)
    if (isBelowViewport) {
      if (scrollTop - renderBuffer > currentOffset) {
        continue // below the area we want to render
      }
    } else {
      if (currentOffset > (scrollTop + height + renderBuffer)) {
        break // above the area we want to render
      }
    }
    visibleItems.push({
      offset: currentOffset,
      props: props,
      key: key,
      index: i
    })
  }
  stop('compute visibleItems')
  return visibleItems
})

virtualListStore.compute('height', ['items', 'itemHeights'], (items, itemHeights) => {
  let sum = 0
  let i = -1
  let len = items.length
  while (++i < len) {
    sum += itemHeights[items[i].key] || 0
  }
  return sum
})

virtualListStore.compute('numItems', ['items'], (items) => items.length)

if (process.browser && process.env.NODE_ENV !== 'production') {
  window.virtualListStore = virtualListStore
}

export {
  virtualListStore
}