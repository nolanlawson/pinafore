export function decodeImage (img) {
  if (typeof img.decode === 'function') {
    return img.decode()
  }

  return new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = reject
  })
}
