// Return true if the unicode is rendered as a double character, e.g.
// "black cat" or "polar bar" or "person with red hair" or other emoji
// that look like double or triple emoji if the unicode is not rendered properly

const BASELINE_EMOJI = '😀'

let baselineWidth

export function testEmojiRenderedAtCorrectSize (unicode) {
  if (!unicode.includes('\u200d')) { // ZWJ
    return true // benefit of the doubt
  }

  let emojiTestDiv = document.getElementById('emoji-test')
  if (!emojiTestDiv) {
    emojiTestDiv = document.createElement('div')
    emojiTestDiv.id = 'emoji-test'
    emojiTestDiv.ariaHidden = true
    Object.assign(emojiTestDiv.style, {
      position: 'absolute',
      opacity: '0',
      'pointer-events': 'none',
      'font-family': 'PinaforeEmoji',
      'font-size': '14px',
      contain: 'content'
    })
    document.body.appendChild(emojiTestDiv)
  }
  emojiTestDiv.textContent = unicode
  const { width } = emojiTestDiv.getBoundingClientRect()
  if (typeof baselineWidth === 'undefined') {
    emojiTestDiv.textContent = BASELINE_EMOJI
    baselineWidth = emojiTestDiv.getBoundingClientRect().width
  }

  // WebKit has some imprecision here, so round it
  const emojiSupported = width.toFixed(2) === baselineWidth.toFixed(2)
  if (!emojiSupported) {
    console.log('Filtered unsupported emoji via size test', unicode, 'width', width, 'baselineWidth', baselineWidth)
  }

  return emojiSupported
}
