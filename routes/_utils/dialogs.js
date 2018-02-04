// From https://gist.github.com/samthor/babe9fad4a65625b301ba482dad284d1
// Via https://github.com/GoogleChrome/dialog-polyfill/issues/139

let registered = new WeakMap()

// store previous focused node centrally
let previousFocus = null
document.addEventListener('focusout', (e) => {
  previousFocus = e.target
}, true)

/**
 * Updates the passed dialog to retain focus and restore it when the dialog is closed.
 * @param {!HTMLDialogElement} dialog to upgrade
 */
export function registerFocusRestoreDialog(dialog) {
  // replace showModal method directly, to save focus
  let realShowModal = dialog.showModal
  dialog.showModal = function () {
    let savedFocus = document.activeElement
    if (savedFocus === document || savedFocus === document.body) {
      // some browsers read activeElement as body
      savedFocus = previousFocus
    }
    registered.set(dialog, savedFocus)
    realShowModal.call(this)
  }

  // on close, try to focus saved, if possible
  dialog.addEventListener('close', function () {
    if (dialog.hasAttribute('open')) {
      return  // in native, this fires the frame later
    }
    let savedFocus = registered.get(dialog)
    if (document.contains(savedFocus)) {
      let wasFocus = document.activeElement
      savedFocus.focus()
      if (document.activeElement !== savedFocus) {
        wasFocus.focus()  // restore focus, we couldn't focus saved
      }
    }
    savedFocus = null
  })
}

export function createDialogElement(label) {
  if (!label) {
    throw new Error('the modal must have a label')
  }
  let dialogElement = document.createElement('dialog')
  dialogElement.classList.add('modal-dialog')
  dialogElement.setAttribute('aria-label', label)
  document.body.appendChild(dialogElement)
  return dialogElement
}