import LoadingMask from '../_components/LoadingMask.html'

let loadingMask

if (process.browser) {
  loadingMask = new LoadingMask({
    target: document.querySelector('#loading-mask')
  })
  if (process.env.NODE_ENV !== 'production') {
    window.loadingMask = loadingMask // for debugging
  }
} else {
  loadingMask = {
  }
}

export { loadingMask }
