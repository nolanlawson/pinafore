export function loadCSS (href) {
  return new Promise((resolve, reject) => {
    let existingLink = document.querySelector(`link[href="${href}"]`)

    if (existingLink) {
      return resolve()
    }
    let link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href

    const cleanup = () => {
      link.removeEventListener('load', onLoad)
      link.removeEventListener('error', onError)
    }
    const onLoad = () => cleanup() && resolve()
    const onError = (err) => cleanup() && reject(err)

    link.addEventListener('load', onLoad)
    link.addEventListener('error', onError)

    document.head.appendChild(link)
  })
}
