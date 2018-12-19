import { registerResizeListener } from '../../_utils/resize'

export function resizeObservers (store) {
  if (!process.browser) {
    return
  }

  const recalculateIsMobileSize = () => {
    store.set({
      isMobileSize: window.matchMedia('(max-width: 767px)').matches, //  e.g. iPhone Plus
      isSmallMobileSize: window.matchMedia('(max-width: 479px)').matches, // e.g. Galaxy S5
      isTinyMobileSize: window.matchMedia('(max-width: 320px)').matches // e.g. iPhone 4
    })
  }

  registerResizeListener(recalculateIsMobileSize)
  recalculateIsMobileSize()
}
