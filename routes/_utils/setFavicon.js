// borrowed from https://github.com/HenrikJoreteg/favicon-setter
export function setFavicon (href) {
  let faviconId = 'theFavicon'
  let link = document.createElement('link')
  let oldLink = document.getElementById(faviconId)
  link.id = faviconId
  link.rel = 'shortcut icon'
  link.type = 'image/png'
  link.href = href
  if (oldLink) {
    document.head.removeChild(oldLink)
  }
  document.head.appendChild(link)
}
