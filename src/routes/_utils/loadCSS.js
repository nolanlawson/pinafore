export function loadCSS (href) {
  let existingLink = document.querySelector(`link[href="${href}"]`)

  if (existingLink) {
    return
  }
  let link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href

  document.head.appendChild(link)
}
