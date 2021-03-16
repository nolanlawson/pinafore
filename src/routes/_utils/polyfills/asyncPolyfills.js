
export const importRequestIdleCallback = () => import(
  /* webpackChunkName: '$polyfill$-requestidlecallback' */ 'requestidlecallback'
)

export const importFocusVisible = () => import(
  /* webpackChunkName: '$polyfill$-focus-visible' */ 'focus-visible'
)

export const importIntlLocale = () => import(
  /* webpackChunkName: '$polyfill$-internationalization' */ '@formatjs/intl-locale/polyfill'
)

export const importIntlPluralRules = async () => { // has to be imported serially
  await import(
    /* webpackChunkName: '$polyfill$-internationalization' */ '@formatjs/intl-pluralrules/polyfill'
  )
  await import(
    /* webpackChunkName: '$polyfill$-internationalization' */ '@formatjs/intl-pluralrules/locale-data/en'
  )
}

export const importIntlRelativeTimeFormat = async () => { // has to be imported serially
  await import(
    /* webpackChunkName: '$polyfill$-internationalization' */ '@formatjs/intl-relativetimeformat/polyfill'
  )
  await import(
    /* webpackChunkName: '$polyfill$-internationalization' */ '@formatjs/intl-relativetimeformat/locale-data/en'
  )
}

export const importIntlListFormat = async () => { // has to be imported serially
  await import(
    /* webpackChunkName: '$polyfill$-internationalization' */ '@formatjs/intl-listformat/polyfill'
  )
  await import(
    /* webpackChunkName: '$polyfill$-internationalization' */ '@formatjs/intl-listformat/locale-data/en'
  )
}
