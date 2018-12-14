// If the user is logged out of all instances, show the "hidden from SSR" styles
// to avoid blank pages
export function onNotLoggedIn () {
  let style = document.createElement('style')
  style.textContent = '.hidden-from-ssr { opacity: 1 !important; }'
  document.head.appendChild(style)
}
