export function pageVisibilityObservers (store) {
  if (!process.browser) {
    return
  }

  document.addEventListener('visibilitychange', () => {
    store.set({ pageVisibilityHidden: document.hidden })
  })
}
