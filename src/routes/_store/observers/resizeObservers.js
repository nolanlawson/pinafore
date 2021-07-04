import { registerResizeListener } from '../../_utils/resize.js'

export function resizeObservers (store) {
  if (!process.browser) {
    return
  }

  const recalculateIsMobileSize = () => {
    store.set({
      isMobileSize: matchMedia('(max-width: 767px)').matches, //  e.g. iPhone Plus
      isSmallMobileSize: matchMedia('(max-width: 479px)').matches, // e.g. Galaxy S5
      isTinyMobileSize: matchMedia('(max-width: 320px)').matches, // e.g. iPhone 4
      isVeryTinyMobileSize: matchMedia('(max-width: 240px)').matches // e.g. Nokia 8110 (KaiOS)
    })
  }

  registerResizeListener(recalculateIsMobileSize)
  recalculateIsMobileSize()
}
