export function decodeImage (img) {
  if (typeof img.decode === 'function' && !img.src.startsWith('data:image/png;base64,')) {
    return img.decode()
  }

  return new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = reject
  })
}
