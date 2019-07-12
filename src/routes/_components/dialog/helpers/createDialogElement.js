export function createDialogElement () {
  const div = document.createElement('div')
  div.setAttribute('class', 'modal-dialog')
  div.setAttribute('aria-hidden', 'true')
  document.body.appendChild(div)
  return div
}
