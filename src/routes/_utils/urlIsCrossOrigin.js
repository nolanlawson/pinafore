export function urlIsCrossOrigin (href) {
  try {
    return new URL(href, location.href).origin !== location.origin
  } catch (e) {
    console.error('Ignoring malformed URL', href)
    return true
  }
}
