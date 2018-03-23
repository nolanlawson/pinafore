// Rough guess at whether this is a "mobile" device or not, for the purposes
// of "device class" estimations

let cached

export function isMobile () {
  if (typeof cached === 'undefined') {
    cached = !!(process.browser && navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/))
  }
  return cached
}
