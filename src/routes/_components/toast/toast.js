import { importToast } from '../../_utils/asyncModules/importToast.js'

let toast

const lazyToast = {
  async say (text) {
    if (!toast) {
      const Toast = await importToast()
      if (!toast) {
        toast = new Toast({
          target: document.querySelector('#theToast')
        })
        if (process.env.NODE_ENV !== 'production') {
          window.toast = toast // for debugging
        }
      }
    }
    toast.say(text)
  }
}

export { lazyToast as toast }
