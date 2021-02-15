
export const importRequestIdleCallback = () => import(
  /* webpackChunkName: '$polyfill$-requestidlecallback' */ 'requestidlecallback'
)

export const importFocusVisible = () => import(
  /* webpackChunkName: '$polyfill$-focus-visible' */ 'focus-visible'
)

export const importRelativeTimeFormat = () => import(
  /* webpackChunkName: '$polyfill$-relative-time-format' */ './relativeTimeFormatPolyfill'
)
