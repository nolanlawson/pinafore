// See https://stackoverflow.com/a/8533927
export function supportsSelector (selector) {
  const style = document.createElement('style')
  document.head.appendChild(style)
  try {
    style.sheet.insertRule(selector + '{}', 0)
  } catch (e) {
    return false
  } finally {
    document.head.removeChild(style)
  }
  return true
}
