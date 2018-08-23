export function decodeImage (src) {
  if (typeof Image.prototype.decode === 'function') {
    let img = new Image()
    img.src = src
    return img.decode()
  }

  return new Promise((resolve, reject) => {
    let img = new Image()
    img.src = src
    img.onload = resolve
    img.onerror = reject
  })
}
