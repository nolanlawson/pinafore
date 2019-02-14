// Per the web share target spec: https://wicg.github.io/web-share-target/
// U+0020 (SPACE) characters are encoded as "+", due to the use of
// application/x-www-form-urlencoded encoding, not "%20" as might be expected.

export function decodeURIComponentWithPluses (text) {
  return text.split('+').map(decodeURIComponent).join(' ')
}
