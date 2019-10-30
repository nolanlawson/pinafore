import { importSnackbar } from '../../_utils/asyncModules/importSnackbar.js'

let snackbar

const lazySnackbar = {
  async announce (text, buttonText, buttonAction) {
    if (!snackbar) {
      const Snackbar = await importSnackbar()
      if (!snackbar) {
        snackbar = new Snackbar({
          target: document.querySelector('#theSnackbar')
        })
        if (process.env.NODE_ENV !== 'production') {
          window.snackbar = snackbar // for debugging
        }
      }
    }
    snackbar.announce(text, buttonText, buttonAction)
  }
}

export { lazySnackbar as snackbar }
