import { loadCSS } from 'fg-loadcss';

export function switchToTheme(themeName) {
  let CL = document.body.classList
  for (let i = 0; i < CL.length; i++) {
    let clazz = CL.item(i)
    if (clazz.startsWith('theme-')) {
      CL.remove(clazz)
    }
  }
  if (themeName !== 'default') {
    CL.add(`theme-${themeName}`)
    loadCSS(`/theme-${themeName}.css`)
  }
}