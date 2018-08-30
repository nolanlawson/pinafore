import { registerResizeListener } from '../../_utils/resize'

export function resizeObservers (store) {
  if (!process.browser) {
    return
  }

  const recalculateIsMobileSize = () => {
    store.set({ isMobileSize: window.matchMedia('(max-width: 767px)').matches })
  }

  registerResizeListener(recalculateIsMobileSize)
  recalculateIsMobileSize()
}
