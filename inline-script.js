// For perf reasons, this script is run inline to quickly set certain styles.
// To allow CSP to work correctly, we also calculate a sha256 hash during
// the build process and write it to inline-script-checksum.json.
window.__themeColors = {
  'default': 'royalblue',
  scarlet: '#e04e41',
  seafoam: '#177380',
  hotpants: 'hotpink',
  oaken: 'saddlebrown',
  majesty: 'blueviolet',
  gecko: '#4ab92f',
  ozark: '#5263af',
  cobalt: '#08439b',
  sorcery: '#ae91e8',
  offline: '#999999'
}
if (localStorage.store_currentInstance && localStorage.store_instanceThemes) {
  let safeParse = (str) => str === 'undefined' ? undefined : JSON.parse(str)
  let theme = safeParse(localStorage.store_instanceThemes)[safeParse(localStorage.store_currentInstance)]
  if (theme !== 'default') {
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
