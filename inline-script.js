// For perf reasons, this script is run inline to quickly set certain styles.
// To allow CSP to work correctly, we also calculate a sha256 hash during
// the build process and write it to inline-script-checksum.json.
window.__themeColors = process.env.THEME_COLORS

if (localStorage.store_currentInstance && localStorage.store_instanceThemes) {
  let safeParse = (str) => str === 'undefined' ? undefined : JSON.parse(str)
  let theme = safeParse(localStorage.store_instanceThemes)[safeParse(localStorage.store_currentInstance)]
  if (theme && theme !== 'default') {
    document.body.classList.add(`theme-${theme}`)
    let link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `/theme-${theme}.css`
    document.head.appendChild(link)
    if (window.__themeColors[theme]) {
      document.getElementById('theThemeColor').content = window.__themeColors[theme]
    }
  }
}

if (!localStorage.store_currentInstance) {
  // if not logged in, show all these 'hidden-from-ssr' elements
  let style = document.createElement('style')
  style.textContent = '.hidden-from-ssr { opacity: 1 !important; }'
  document.head.appendChild(style)
}

// TODO: remove this hack when Safari works with cross-origin window.open()
// in a PWA: https://github.com/nolanlawson/pinafore/issues/45
if (/iP(?:hone|ad|od)/.test(navigator.userAgent)) {
  document.head.removeChild(document.getElementById('theManifest'))
}
