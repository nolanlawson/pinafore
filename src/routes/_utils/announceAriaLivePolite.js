const ariaLiveElement = process.browser && document.getElementById('theAriaLive')

export function announceAriaLivePolite (text) {
  ariaLiveElement.textContent = text
}
