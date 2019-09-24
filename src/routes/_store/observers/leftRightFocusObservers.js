// Makes it so the left and right arrows change focus, ala Tab/Shift+Tab. This is mostly designed
// for KaiOS devices.

export function leftRightFocusObservers (store) {
  if (!process.browser) {
    return
  }

  function getDialogParent (element) {
    let parent = element.parentElement
    while (parent) {
      if (parent.classList.contains('modal-dialog')) {
        return parent
      }
      parent = parent.parentElement
    }
  }

  function getFocusableElements (activeElement) {
    const query = `
    a,
    button, 
    textarea, 
    input[type=text], 
    input[type=number],
    input[type=search],
    input[type=radio],
    input[type=checkbox],
    select, 
    [tabindex="0"]
  `

    // Respect focus trap inside of dialogs
    const dialogParent = getDialogParent(activeElement)
    const root = dialogParent || document

    return Array.from(root.querySelectorAll(query))
      .filter(element => {
        if (element === activeElement) {
          return true
        }
        return !element.disabled &&
          element.getAttribute('tabindex') !== '-1' &&
          (element.offsetWidth > 0 || element.offsetHeight > 0)
      })
  }

  function shouldIgnoreEvent (activeElement, key) {
    const isTextarea = activeElement.tagName === 'TEXTAREA'
    const isTextInput = activeElement.tagName === 'INPUT' &&
      ['input', 'search'].includes(activeElement.getAttribute('type'))

    if (!isTextarea && !isTextInput) {
      return false
    }

    const { selectionStart, selectionEnd } = activeElement
    // if the cursor is at the start or end of the textarea and the user wants to navigate out of it,
    // then do so
    if (key === 'ArrowLeft' && selectionStart === selectionEnd && selectionStart === 0) {
      return false
    } else if (key === 'ArrowRight' && selectionStart === selectionEnd && selectionStart === activeElement.value.length) {
      return false
    }
    return true
  }

  function focusNextOrPrevious (event, key) {
    const { activeElement } = document
    if (shouldIgnoreEvent(activeElement, key)) {
      return
    }
    const focusable = getFocusableElements(activeElement)
    const index = focusable.indexOf(activeElement)
    let element
    if (key === 'ArrowLeft') {
      console.log('focus previous')
      element = focusable[index - 1] || focusable[0]
    } else { // ArrowRight
      console.log('focus next')
      element = focusable[index + 1] || focusable[focusable.length - 1]
    }
    element.focus()
    event.preventDefault()
    event.stopPropagation()
  }

  function handleEnter (event) {
    const { activeElement } = document
    if (activeElement.tagName === 'INPUT' && ['checkbox', 'radio'].includes(activeElement.getAttribute('type'))) {
      // Explicitly override "enter" on an input and make it fire the checkbox/radio
      activeElement.click()
      event.preventDefault()
      event.stopPropagation()
    }
  }

  function keyListener (event) {
    if (event.altKey || event.metaKey || event.ctrlKey) {
      return // ignore e.g. Alt-Left and Ctrl-Right, which are used to switch browser tabs or navigate back/forward
    }
    const { key } = event
    switch (key) {
      case 'ArrowLeft':
      case 'ArrowRight': {
        focusNextOrPrevious(event, key)
        break
      }
      case 'Enter': {
        handleEnter(event)
        break
      }
    }
  }

  store.observe('leftRightChangesFocus', leftRightChangesFocus => {
    if (leftRightChangesFocus) {
      window.addEventListener('keydown', keyListener)
    } else {
      window.removeEventListener('keydown', keyListener)
    }
  })
}
