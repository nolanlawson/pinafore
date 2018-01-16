import { Store } from 'svelte/store.js'

const RENDER_BUFFER = 1000

class VirtualListStore extends Store {
}

const virtualListStore = new VirtualListStore({
  items: [],
  itemHeights: {},
  scrollTop: 0
})

virtualListStore.compute('visibleItems',
    ['items', 'scrollTop', 'height', 'itemHeights', 'innerHeight'],
    (items, scrollTop, height, itemHeights, innerHeight) => {
  let visibleItems = []
  let currentOffset = 0
  items.forEach((item, index) => {
    let { props, key } = item
    let height = itemHeights[key] || 0
    console.log(key, 'scrollTop', scrollTop, 'currentOffset', currentOffset, 'innerHeight', innerHeight)
    if (
      ((currentOffset < scrollTop)  && (scrollTop - RENDER_BUFFER < currentOffset)) ||
      ((currentOffset >= scrollTop) && (currentOffset < (scrollTop + innerHeight + RENDER_BUFFER)))
    ) {
      console.log('    rendering', key)
      visibleItems.push({
        offset: currentOffset,
        props: props,
        key: key,
        index: index
      })
    } else {
      console.log('not rendering', key)
    }
    currentOffset += height
  })
  return visibleItems
})

virtualListStore.compute('height', ['items', 'itemHeights'], (items, itemHeights) => {
  let sum = 0
  items.forEach(item => {
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