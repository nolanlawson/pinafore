import { mark, stop } from '../../_utils/marks'
import { RealmStore } from '../../_utils/RealmStore'

const VIEWPORT_RENDER_FACTOR = 4

class VirtualListStore extends RealmStore {
  constructor(state) {
    super(state, /* maxSize */ 10)
  }
}

const virtualListStore = new VirtualListStore()

virtualListStore.computeForRealm('items', null)
virtualListStore.computeForRealm('showFooter', false)
virtualListStore.computeForRealm('footerHeight', 0)
virtualListStore.computeForRealm('scrollTop', 0)
virtualListStore.computeForRealm('scrollHeight', 0)
virtualListStore.computeForRealm('offsetHeight', 0)
virtualListStore.computeForRealm('itemHeights', {})

virtualListStore.compute('visibleItems',
    ['items', 'scrollTop', 'itemHeights', 'offsetHeight'],
    (items, scrollTop, itemHeights, offsetHeight) => {
  mark('compute visibleItems')
  if (!items) {
    return null
  }
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
  if (!items) {
    return 0
  }
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

virtualListStore.compute('length', ['items'], (items) => items ? items.length : 0)

virtualListStore.compute('allVisibleItemsHaveHeight',
    ['visibleItems', 'itemHeights'],
    (visibleItems, itemHeights) => {
  if (!visibleItems) {
    return false
  }
  for (let visibleItem of visibleItems) {
    if (!itemHeights[visibleItem.key]) {
      return false
    }
  }
  return true
})

if (process.browser && process.env.NODE_ENV !== 'production') {
  window.virtualListStore = virtualListStore
}

export {
  virtualListStore
}