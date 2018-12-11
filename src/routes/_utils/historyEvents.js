// hacky way to listen for pushState/replaceState changes
// per https://stackoverflow.com/a/25673911/680742

function wrapper (type) {
  let orig = history[type]
  return function () {
    let result = orig.apply(this, arguments)
    let e = new Event(type)
    e.arguments = arguments
    window.dispatchEvent(e)
    return result
  }
}

if (process.browser) {
  history.pushState = wrapper('pushState')
  history.replaceState = wrapper('replaceState')
}
