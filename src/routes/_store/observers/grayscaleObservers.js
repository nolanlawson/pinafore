export function grayscaleObservers (store) {
  if (!process.browser) {
    return
  }

  store.observe('enableGrayscale', enableGrayscale => {
    document.body.classList.toggle('grayscale', !!enableGrayscale)
  })
}
