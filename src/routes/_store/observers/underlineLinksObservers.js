import { store } from '../store'

export function underlineLinksObservers () {
  store.observe('underlineLinks', underlineLinks => {
    if (!process.browser) {
      return
    }

    // disables or enables the style
    document.body.classList.toggle('underline-links', underlineLinks)
  }, { init: false })
}
