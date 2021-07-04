import { themes } from '../_static/themes.js'
import { DEFAULT_THEME } from './themeEngine.js'

export function isDarkTheme (themeName) {
  const theme = themes.find(_ => _.name === themeName) || themes.find(_ => _.name === DEFAULT_THEME)
  return theme.dark
}
