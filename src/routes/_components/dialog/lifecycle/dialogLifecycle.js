import QuickLRU from 'quick-lru'

if (process.browser) {
  window.addEventListener('pushstate', onPushState)
  window.addEventListener('popstate')
}

let cache = new QuickLRU({ maxSize: 10 })

function onPushState (event) {
  if (!event.modal) {
    return
  }

  let id = event.modal



}
