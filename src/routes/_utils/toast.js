import Toast from '../_components/Toast.html'

let toast

if (process.browser) {
  toast = new Toast({
    target: document.querySelector('#toast')
  })
  if (process.env.NODE_ENV !== 'production') {
    window.toast = toast // for debugging
  }
} else {
  toast = {
    say: () => {}
  }
}

export { toast }
