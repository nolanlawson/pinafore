import { loadCSS } from 'fg-loadcss';

let meta = process.browser && document.querySelector('meta[name="theme-color"]')

export function switchToTheme(themeName) {
  let clazzList = document.body.classList
  for (let i = 0; i < clazzList.length; i++) {
    let clazz = clazzList.item(i)
    if (clazz.startsWith('theme-')) {
      clazzList.remove(clazz)
    }
  }
  let themeColor = window.__themeColors[themeName]
  meta.content = themeColor || window.__themeColors['default']
  if (themeName !== 'default') {
    clazzList.add(`theme-${themeName}`)
    loadCSS(`/theme-${themeName}.css`)
  }
}