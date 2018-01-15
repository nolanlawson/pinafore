import { Store } from 'svelte/store.js'
import { splice } from 'svelte-extras'

class VirtualListStore extends Store {
}

VirtualListStore.prototype.splice = splice

const virtualListStore = new VirtualListStore({
  items: [],
  itemHeights: {},
  scrollTop: 0
})

virtualListStore.compute('virtualItems', ['items'], (items) => {
  return items.map((item, idx) => ({
    props: item.props,
    key: item.key,
    index: idx
  }))
})

virtualListStore.compute('itemOffsets', ['virtualItems', 'itemHeights'], (virtualItems, itemHeights) => {
  let itemOffsets = {}
  let totalHeight = 0
  virtualItems.forEach(item => {
    let height = itemHeights[item.key] || 0
    itemOffsets[item.key] = totalHeight
    totalHeight += height
  })
  return itemOffsets
})

virtualListStore.compute('height', ['virtualItems', 'itemHeights'], (virtualItems, itemHeights) => {
  let sum = 0
  virtualItems.forEach(item => {
    sum += itemHeights[item.key] || 0
  })
  return sum
})

if (process.browser && process.env.NODE_ENV !== 'production') {
  window.virtualListStore = virtualListStore
}

export {
  virtualListStore
}