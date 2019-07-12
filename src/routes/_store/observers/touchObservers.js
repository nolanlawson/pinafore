export function touchObservers (store) {
  if (!process.browser) {
    return
  }

  const onTouch = () => {
    store.set({ isUserTouching: true })
    window.removeEventListener('touchstart', onTouch)
  }

  window.addEventListener('touchstart', onTouch, { passive: true })
}
