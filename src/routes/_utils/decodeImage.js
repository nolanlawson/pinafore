const IS_FIREFOX = process.browser && /Firefox/.test(navigator.userAgent)

export function decodeImage (img) {
  // Remove this UA sniff when the Firefox bug is fixed
  // https://github.com/nolanlawson/pinafore/issues/1344#issuecomment-514312672
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1565542
  if (!IS_FIREFOX && typeof img.decode === 'function') {
    return img.decode()
  }

  return new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = reject
  })
}
