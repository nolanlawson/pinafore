// When the user is logged out, we need to be sure to re-show all the "hidden from SSR" styles
// so that we don't get a blank page.
export function onUserIsLoggedOut () {
  if (document.getElementById('hiddenFromSsrStyle')) {
    return
  }
  const style = document.createElement('style')
  style.setAttribute('id', 'hiddenFromSsrStyle')
  style.textContent = '.hidden-from-ssr { opacity: 1 !important; }'
  document.head.appendChild(style)
}
