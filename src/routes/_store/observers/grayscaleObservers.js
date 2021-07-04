import { switchToTheme } from '../../_utils/themeEngine.js'

const style = process.browser && document.getElementById('theGrayscaleStyle')

export function grayscaleObservers (store) {
  if (!process.browser) {
    return
  }

  store.observe('enableGrayscale', enableGrayscale => {
    const { instanceThemes, currentInstance } = store.get()
    const theme = instanceThemes && instanceThemes[currentInstance]
    style.setAttribute('media', enableGrayscale ? 'all' : 'only x') // disable or enable the style
    switchToTheme(theme, enableGrayscale)
  })
}
