import { Store } from 'svelte/store.js'
import { splice } from 'svelte-extras'

const RENDER_BUFFER = 1000

class VirtualListStore extends Store {
}

VirtualListStore.prototype.splice = splice

const virtualListStore = new VirtualListStore({
  items: [],
  itemHeights: {},
  scrollTop: 0,
  scrollHeight: 0
})

virtualListStore.compute('virtualItems', ['items'], (items) => {
  return items.map((item, idx) => ({
    props: item.props,
    key: item.key,
    index: idx
  }))
})

virtualListStore.compute('visibleItems',
    ['virtualItems', 'scrollTop', 'height', 'itemHeights', 'innerHeight'],
    (virtualItems, scrollTop, height, itemHeights, innerHeight) => {
  let visibleItems = []
  let currentOffset = 0
  virtualItems.forEach(item => {
    let height = itemHeights[item.key] || 0
    console.log(item.key, 'scrollTop', scrollTop, 'currentOffset', currentOffset, 'innerHeight', innerHeight)
    if (
      ((currentOffset < scrollTop)  && (scrollTop - RENDER_BUFFER < currentOffset)) ||
      ((currentOffset >= scrollTop) && (currentOffset < (scrollTop + innerHeight + RENDER_BUFFER)))
    ) {
      console.log('    rendering', item)
      visibleItems.push({
        item: item,
        offset: currentOffset
      })
    } else {
      console.log('not rendering', item)
    }
    currentOffset += height
  })
  return visibleItems
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