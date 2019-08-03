// hacky way to listen for pushState/replaceState changes
// per https://stackoverflow.com/a/25673911/680742

function wrapper (type) {
  const orig = history[type]
  return function () {
    const result = orig.apply(this, arguments)
    const e = new Event(type)
    e.arguments = arguments
    window.dispatchEvent(e)
    return result
  }
}

if (process.browser) {
  history.pushState = wrapper('pushState')
  history.replaceState = wrapper('replaceState')
}
