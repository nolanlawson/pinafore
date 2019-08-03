// borrowed from https://github.com/HenrikJoreteg/favicon-setter
export function setFavicon (href) {
  const faviconId = 'theFavicon'
  const oldLink = document.getElementById(faviconId)

  if (oldLink.getAttribute('href') === href) {
    return
  }

  const link = document.createElement('link')
  link.id = faviconId
  link.rel = 'shortcut icon'
  link.type = 'image/png'
  link.href = href
  document.head.removeChild(oldLink)
  document.head.appendChild(link)
}
