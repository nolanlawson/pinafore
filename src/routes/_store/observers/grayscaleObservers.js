import { switchToTheme } from '../../_utils/themeEngine'

export function grayscaleObservers (store) {
  if (!process.browser) {
    return
  }

  store.observe('enableGrayscale', enableGrayscale => {
    const { instanceThemes, currentInstance } = store.get()
    const theme = instanceThemes && instanceThemes[currentInstance]
    document.body.classList.toggle('grayscale', enableGrayscale)
    switchToTheme(theme, enableGrayscale)
  })
}
