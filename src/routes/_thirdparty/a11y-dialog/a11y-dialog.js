// Forked from a11y-dialog 4.0.1, adding a small change to element.focus() to work
// around a Chrome bug with sticky positioning (https://github.com/nolanlawson/pinafore/issues/671)
// Now it also works around shadow DOM and video/audio with controls.
// (video/audio with controls is not 100% fixable because we can't focus the elements inside, but
// you can at least tab to the video/audio and use other controls, like space bar and left/right)
// Original: https://unpkg.com/a11y-dialog@4.0.1/a11y-dialog.js

export const FOCUSABLE_ELEMENTS_QUERY = 'a[href], area[href], input, select, textarea, ' +
  'button, iframe, object, embed, [contenteditable], [tabindex], ' +
  'video[controls], audio[controls], summary'
const TAB_KEY = 9
const ESCAPE_KEY = 27
const shadowRoots = []
let focusedBeforeDialog

/**
   * Define the constructor to instantiate a dialog
   *
   * @constructor
   * @param {Element} node
   * @param {(NodeList | Element | string)} targets
   */
function A11yDialog (node, targets) {
  // Prebind the functions that will be bound in addEventListener and
  // removeEventListener to avoid losing references
  this._show = this.show.bind(this)
  this._hide = this.hide.bind(this)
  this._maintainFocus = this._maintainFocus.bind(this)
  this._bindKeypress = this._bindKeypress.bind(this)

  // Keep a reference of the node on the instance
  this.node = node

  // Keep an object of listener types mapped to callback functions
  this._listeners = {}

  // Initialise everything needed for the dialog to work properly
  this.create(targets)
}

/**
   * Set up everything necessary for the dialog to be functioning
   *
   * @param {(NodeList | Element | string)} targets
   * @return {this}
   */
A11yDialog.prototype.create = function (targets) {
  // Keep a collection of nodes to disable/enable when toggling the dialog
  this._targets = this._targets || collect(targets) || getSiblings(this.node)

  // Make sure the dialog element is disabled on load, and that the `shown`
  // property is synced with its value
  this.node.setAttribute('aria-hidden', true)
  this.shown = false

  // Keep a collection of dialog openers, each of which will be bound a click
  // event listener to open the dialog
  this._openers = $$('[data-a11y-dialog-show="' + this.node.id + '"]')
  this._openers.forEach(function (opener) {
    opener.addEventListener('click', this._show)
  }.bind(this))

  // Keep a collection of dialog closers, each of which will be bound a click
  // event listener to close the dialog
  this._closers = $$('[data-a11y-dialog-hide]', this.node)
    .concat($$('[data-a11y-dialog-hide="' + this.node.id + '"]'))
  this._closers.forEach(function (closer) {
    closer.addEventListener('click', this._hide)
  }.bind(this))

  // Execute all callbacks registered for the `create` event
  this._fire('create')

  return this
}

/**
   * Show the dialog element, disable all the targets (siblings), trap the
   * current focus within it, listen for some specific key presses and fire all
   * registered callbacks for `show` event
   *
   * @param {Event} event
   * @return {this}
   */
A11yDialog.prototype.show = function (event) {
  // If the dialog is already open, abort
  if (this.shown) {
    return this
  }

  this.shown = true
  this.node.removeAttribute('aria-hidden')

  // Iterate over the targets to disable them by setting their `aria-hidden`
  // attribute to `true`; in case they already have this attribute, keep a
  // reference of their original value to be able to restore it later
  this._targets.forEach(function (target) {
    const original = target.getAttribute('aria-hidden')

    if (original) {
      target.setAttribute('data-a11y-dialog-original', original)
    }

    target.setAttribute('aria-hidden', 'true')
  })

  // Keep a reference to the currently focused element to be able to restore
  // it later, then set the focus to the first focusable child of the dialog
  // element
  focusedBeforeDialog = document.activeElement
  setFocusToFirstItem(this.node)

  // Bind a focus event listener to the body element to make sure the focus
  // stays trapped inside the dialog while open, and start listening for some
  // specific key presses (TAB and ESC)
  document.body.addEventListener('focus', this._maintainFocus, true)
  document.addEventListener('keydown', this._bindKeypress)

  // Execute all callbacks registered for the `show` event
  this._fire('show', event)

  return this
}

/**
   * Hide the dialog element, enable all the targets (siblings), restore the
   * focus to the previously active element, stop listening for some specific
   * key presses and fire all registered callbacks for `hide` event
   *
   * @param {Event} event
   * @return {this}
   */
A11yDialog.prototype.hide = function (event) {
  // If the dialog is already closed, abort
  if (!this.shown) {
    return this
  }

  this.shown = false
  this.node.setAttribute('aria-hidden', 'true')

  // Iterate over the targets to enable them by remove their `aria-hidden`
  // attribute or resetting them to their initial value
  this._targets.forEach(function (target) {
    const original = target.getAttribute('data-a11y-dialog-original')

    if (original) {
      target.setAttribute('aria-hidden', original)
      target.removeAttribute('data-a11y-dialog-original')
    } else {
      target.removeAttribute('aria-hidden')
    }
  })

  // If their was a focused element before the dialog was opened, restore the
  // focus back to it
  if (focusedBeforeDialog) {
    // This double rAF is to work around a bug in Chrome when focusing sticky-positioned
    // elements. See https://github.com/nolanlawson/pinafore/issues/671
    requestAnimationFrame(() => requestAnimationFrame(() => focusedBeforeDialog.focus()))
  }

  // Remove the focus event listener to the body element and stop listening
  // for specific key presses
  document.body.removeEventListener('focus', this._maintainFocus, true)
  document.removeEventListener('keydown', this._bindKeypress)

  // Execute all callbacks registered for the `hide` event
  this._fire('hide', event)

  return this
}

/**
   * Destroy the current instance (after making sure the dialog has been hidden)
   * and remove all associated listeners from dialog openers and closers
   *
   * @return {this}
   */
A11yDialog.prototype.destroy = function () {
  // Hide the dialog to avoid destroying an open instance
  this.hide()

  // Remove the click event listener from all dialog openers
  this._openers.forEach(function (opener) {
    opener.removeEventListener('click', this._show)
  }.bind(this))

  // Remove the click event listener from all dialog closers
  this._closers.forEach(function (closer) {
    closer.removeEventListener('click', this._hide)
  }.bind(this))

  // Execute all callbacks registered for the `destroy` event
  this._fire('destroy')

  // Keep an object of listener types mapped to callback functions
  this._listeners = {}

  return this
}

/**
   * Register a new callback for the given event type
   *
   * @param {string} type
   * @param {Function} handler
   */
A11yDialog.prototype.on = function (type, handler) {
  if (typeof this._listeners[type] === 'undefined') {
    this._listeners[type] = []
  }

  this._listeners[type].push(handler)

  return this
}

/**
   * Unregister an existing callback for the given event type
   *
   * @param {string} type
   * @param {Function} handler
   */
A11yDialog.prototype.off = function (type, handler) {
  const index = this._listeners[type].indexOf(handler)

  if (index > -1) {
    this._listeners[type].splice(index, 1)
  }

  return this
}

/**
   * Iterate over all registered handlers for given type and call them all with
   * the dialog element as first argument, event as second argument (if any).
   *
   * @access private
   * @param {string} type
   * @param {Event} event
   */
A11yDialog.prototype._fire = function (type, event) {
  const listeners = this._listeners[type] || []

  listeners.forEach(function (listener) {
    listener(this.node, event)
  }.bind(this))
}

/**
   * Private event handler used when listening to some specific key presses
   * (namely ESCAPE and TAB)
   *
   * @access private
   * @param {Event} event
   */
A11yDialog.prototype._bindKeypress = function (event) {
  // If the dialog is shown and the ESCAPE key is being pressed, prevent any
  // further effects from the ESCAPE key and hide the dialog
  if (this.shown && event.which === ESCAPE_KEY) {
    event.preventDefault()
    this.hide()
  }

  // If the dialog is shown and the TAB key is being pressed, make sure the
  // focus stays trapped within the dialog element
  if (this.shown && event.which === TAB_KEY) {
    trapTabKey(this.node, event)
  }
}

/**
   * Private event handler used when making sure the focus stays within the
   * currently open dialog
   *
   * @access private
   * @param {Event} event
   */
A11yDialog.prototype._maintainFocus = function (event) {
  // If the dialog is shown and the focus is not within the dialog element,
  // move it back to its first focusable child
  if (this.shown && !this.node.contains(event.target)) {
    setFocusToFirstItem(this.node)
  }
}

/**
   * Convert a NodeList into an array
   *
   * @param {NodeList} collection
   * @return {Array<Element>}
   */
function toArray (collection) {
  return Array.prototype.slice.call(collection)
}

/**
   * Query the DOM for nodes matching the given selector, scoped to context (or
   * the whole document)
   *
   * @param {String} selector
   * @param {Element} [context = document]
   * @return {Array<Element>}
   */
function $$ (selector, context) {
  return toArray((context || document).querySelectorAll(selector))
}

/**
   * Return an array of Element based on given argument (NodeList, Element or
   * string representing a selector)
   *
   * @param {(NodeList | Element | string)} target
   * @return {Array<Element>}
   */
function collect (target) {
  if (NodeList.prototype.isPrototypeOf(target)) { // eslint-disable-line no-prototype-builtins
    return toArray(target)
  }

  if (Element.prototype.isPrototypeOf(target)) { // eslint-disable-line no-prototype-builtins
    return [target]
  }

  if (typeof target === 'string') {
    return $$(target)
  }
}

/**
   * Set the focus to the first focusable child of the given element
   *
   * @param {Element} node
   */
function setFocusToFirstItem (node) {
  const focusableChildren = getFocusableChildren(node)

  if (focusableChildren.length) {
    focusableChildren[0].focus()
  }
}

function isAncestor (node, ancestor) {
  let parent = node
  while (parent) {
    parent = parent.parentElement
    if (parent === ancestor) {
      return true
    }
  }
  return false
}

/**
   * Get the focusable children of the given element
   *
   * @param {Element} node
   * @return {Array<Element>}
   */
function getFocusableChildren (node) {
  const candidateFocusableChildren = $$(FOCUSABLE_ELEMENTS_QUERY, node)
  for (const shadowRoot of shadowRoots) {
    if (isAncestor(shadowRoot.getRootNode().host, node)) {
      // TODO: technically we should figure out the host's position in the DOM
      // and insert the children there, but this works for the emoji picker dialog well
      // enough, and that's our only shadow root, so it's fine for now.
      candidateFocusableChildren.push(...shadowRoot.querySelectorAll(FOCUSABLE_ELEMENTS_QUERY))
    }
  }
  return candidateFocusableChildren.filter(child => {
    return !child.disabled &&
    !/^-/.test(child.getAttribute('tabindex') || '') &&
    !child.hasAttribute('inert') && // see https://github.com/GoogleChrome/inert-polyfill
    (child.offsetWidth || child.offsetHeight || child.getClientRects().length)
  })
}

/**
   * Trap the focus inside the given element
   *
   * @param {Element} node
   * @param {Event} event
   */
function trapTabKey (node, event) {
  const focusableChildren = getFocusableChildren(node)
  let activeElement = document.activeElement
  for (const shadowRoot of shadowRoots) {
    if (shadowRoot.getRootNode().host === activeElement) {
      activeElement = shadowRoot.activeElement
      break
    }
  }
  const focusedItemIndex = focusableChildren.indexOf(activeElement)

  // If the SHIFT key is being pressed while tabbing (moving backwards) and
  // the currently focused item is the first one, move the focus to the last
  // focusable item from the dialog element
  if (event.shiftKey && focusedItemIndex === 0) {
    focusableChildren[focusableChildren.length - 1].focus()
    event.preventDefault()
    // If the SHIFT key is not being pressed (moving forwards) and the currently
    // focused item is the last one, move the focus to the first focusable item
    // from the dialog element
  } else if (!event.shiftKey && focusedItemIndex === focusableChildren.length - 1) {
    focusableChildren[0].focus()
    event.preventDefault()
  }
}

/**
   * Retrieve siblings from given element
   *
   * @param {Element} node
   * @return {Array<Element>}
   */
function getSiblings (node) {
  const nodes = toArray(node.parentNode.childNodes)
  const siblings = nodes.filter(function (node) {
    return node.nodeType === 1
  })

  siblings.splice(siblings.indexOf(node), 1)

  return siblings
}

function registerShadowRoot (shadowRoot) {
  if (!shadowRoots.includes(shadowRoot)) {
    shadowRoots.push(shadowRoot)
  }
}

function unregisterShadowRoot (shadowRoot) {
  const index = shadowRoots.indexOf(shadowRoot)
  if (index !== -1) {
    shadowRoots.splice(index, 1)
  }
}

export { A11yDialog, registerShadowRoot, unregisterShadowRoot }
