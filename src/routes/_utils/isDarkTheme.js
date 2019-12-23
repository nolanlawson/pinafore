import { themes } from '../_static/themes'
import { DEFAULT_THEME } from './themeEngine'

export function isDarkTheme (themeName) {
  const theme = themes.find(_ => _.name === themeName) || themes.find(_ => _.name === DEFAULT_THEME)
  return theme.dark
}
