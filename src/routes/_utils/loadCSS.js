export function loadCSS (href) {
  const existingLink = document.querySelector(`link[href="${href}"]`)

  if (existingLink) {
    return
  }
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href

  document.head.appendChild(link)
}
