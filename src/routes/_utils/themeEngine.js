let meta = process.browser && document.getElementById('theThemeColor')
let offlineStyle = process.browser && document.getElementById('theOfflineStyle')

function getExistingThemeLink () {
  return document.head.querySelector('link[rel=stylesheet][href^="/theme-"]')
}

function resetExistingTheme () {
  let existingLink = getExistingThemeLink()
  if (existingLink) {
    document.head.removeChild(existingLink)
  }
}

function loadCSS (href) {
  let existingLink = getExistingThemeLink()

  let link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href

  link.addEventListener('load', function onload () {
    link.removeEventListener('load', onload)
    if (existingLink) { // remove after load to avoid flash of default theme
      document.head.removeChild(existingLink)
    }
  })

  // inserting before the offline <style> ensures that the offline style wins when offline
  document.head.insertBefore(link, offlineStyle)
}

export function switchToTheme (themeName) {
  let themeColor = window.__themeColors[themeName]
  meta.content = themeColor || window.__themeColors['default']
  if (themeName !== 'default') {
    loadCSS(`/theme-${themeName}.css`)
  } else {
    resetExistingTheme()
  }
}
