export function restoreFocus (element, selector) {
  // Have to check from the parent because otherwise this element itself wouldn't match.
  // This is fine for <article class=status> elements because they already have a div wrapper.
  let elementToFocus = element.parentElement.querySelector(selector)
  console.log('restoreFocus', selector, elementToFocus)
  if (elementToFocus) {
    elementToFocus.focus()
  }
}
