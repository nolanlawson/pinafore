import { mark, stop } from '../../_utils/marks'
import { RealmStore } from '../../_utils/RealmStore'
import { reselect } from '../../_utils/reselect'

const VIEWPORT_RENDER_FACTOR = 5

// TODO: Hack because compose box takes up roughly this amount of pixels.
// Ideally we should calculate that the .virtual-list is X number of pixels
// below the .container and then offset everything by that.
const HIGH_PRIORITY_TOP_BUFFER = 600

class VirtualListStore extends RealmStore {
  constructor (state) {
    super(state, /* maxSize */ 10)
  }
}

const virtualListStore = new VirtualListStore()

virtualListStore.computeForRealm('items', null)
virtualListStore.computeForRealm('showFooter', false)
virtualListStore.computeForRealm('footerHeight', 0)
virtualListStore.computeForRealm('showHeader', false)
virtualListStore.computeForRealm('headerHeight', 0)
virtualListStore.computeForRealm('scrollTop', 0)
virtualListStore.computeForRealm('scrollHeight', 0)
virtualListStore.computeForRealm('offsetHeight', 0)
virtualListStore.computeForRealm('itemHeights', {})

virtualListStore.compute('rawVisibleItems',
    ['items', 'scrollTop', 'itemHeights', 'offsetHeight', 'showHeader', 'headerHeight'],
    (items, scrollTop, itemHeights, offsetHeight, showHeader, headerHeight) => {
      window.rawVisibleItemsComputed = (window.rawVisibleItemsComputed || 0) + 1
      mark('compute visibleItems')
      if (!items) {
        return null
      }
      let renderBuffer = VIEWPORT_RENDER_FACTOR * offsetHeight
      let visibleItems = []
      let totalOffset = showHeader ? headerHeight : 0
      let len = items.length
      let i = -1
      while (++i < len) {
        let key = items[i]
        let height = itemHeights[key] || 0
        let currentOffset = totalOffset
        totalOffset += height
        let isAboveViewport = (currentOffset < scrollTop)
        if (isAboveViewport) {
          if ((scrollTop - height - renderBuffer) > currentOffset) {
            continue // above the area we want to render
          }
        } else {
          if (currentOffset > (scrollTop + offsetHeight + renderBuffer)) {
            break // below the area we want to render
          }
        }
        let lowPriority = ((currentOffset + height + HIGH_PRIORITY_TOP_BUFFER) < scrollTop) ||
          (currentOffset > (scrollTop + offsetHeight))
        visibleItems.push({
          offset: currentOffset,
          key: key,
          index: i,
          lowPriority: lowPriority
        })
      }
      stop('compute visibleItems')
      return visibleItems
    })

reselect(virtualListStore, 'visibleItems', 'rawVisibleItems')

virtualListStore.compute('heightWithoutFooter',
    ['items', 'itemHeights', 'showHeader', 'headerHeight'],
    (items, itemHeights, showHeader, headerHeight) => {
      if (!items) {
        return 0
      }
      let sum = showHeader ? headerHeight : 0
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

  virtualListStore.observe('visibleItems', () => {
    window.visibleItemsChangedCount = (window.visibleItemsChangedCount || 0) + 1
  })

  virtualListStore.observe('rawVisibleItems', () => {
    window.rawVisibleItemsChangedCount = (window.rawVisibleItemsChangedCount || 0) + 1
  })
}

export {
  virtualListStore
}
