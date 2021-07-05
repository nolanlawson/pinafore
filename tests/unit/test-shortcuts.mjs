/* global describe, it, beforeEach, afterEach */

import {
  initShortcuts,
  addShortcutFallback,
  addToShortcutScope,
  onKeyDownInShortcutScope,
  popShortcutScope,
  pushShortcutScope,
  removeFromShortcutScope
} from '../../src/routes/_utils/shortcuts.js'
import assert from 'assert'

function KeyDownEvent (key) {
  this.key = key
  this.metaKey = false
  this.ctrlKey = false
  this.shiftKey = false
  this.altKey = false
  this.target = null
}

function Component (keyDownFunction) {
  this.lastEvent = null
  this.eventCount = 0
  this.onKeyDown = function (event) {
    this.lastEvent = event
    this.eventCount++
  }
  this.pressed = function () {
    return this.eventCount > 0
  }
  this.notPressed = function () {
    return this.eventCount === 0
  }
}

describe('test-shortcuts.js', function () {
  let eventListener
  let originalWindow

  beforeEach(function () {
    originalWindow = global.window
    global.window = {
      addEventListener: function (eventname, listener) {
        assert.strictEqual(eventname, 'keydown')
        eventListener = listener
      },
      removeEventListener: function (eventname, listener) {
        assert.strictEqual(eventname, 'keydown')
        if (listener === eventListener) {
          eventListener = null
        }
      }
    }
    initShortcuts()
  })
  afterEach(function () {
    global.window = originalWindow
  })

  it('sets and unsets event listener', function () {
    const component = new Component()

    addToShortcutScope('global', 'k', component)
    assert(eventListener != null, 'event listener not set')
    removeFromShortcutScope('global', 'k', component)
    assert(eventListener == null, 'event listener not reset')
  })

  it('forwards the right global key event', function () {
    const component = new Component()

    addToShortcutScope('global', 'k', component)

    eventListener(new KeyDownEvent('l'))
    assert.ok(component.notPressed())

    const kEvent = new KeyDownEvent('k')
    eventListener(kEvent)
    assert.ok(component.pressed())
    assert.strictEqual(component.lastEvent, kEvent)
  })

  it('register multiple keys', function () {
    const lmn = new Component()

    addToShortcutScope('global', 'l|m|n', lmn)

    eventListener(new KeyDownEvent('x'))
    assert.strictEqual(lmn.eventCount, 0)
    eventListener(new KeyDownEvent('m'))
    assert.strictEqual(lmn.eventCount, 1)
    eventListener(new KeyDownEvent('l'))
    assert.strictEqual(lmn.eventCount, 2)
    eventListener(new KeyDownEvent('n'))
    assert.strictEqual(lmn.eventCount, 3)
  })

  it('skips events with modifiers', function () {
    const component = new Component()

    addToShortcutScope('global', 'k', component)

    let kEvent = new KeyDownEvent('k')
    kEvent.shiftKey = true
    eventListener(kEvent)
    assert.ok(component.notPressed())

    kEvent = new KeyDownEvent('k')
    kEvent.ctrlKey = true
    eventListener(kEvent)
    assert.ok(component.notPressed())

    kEvent = new KeyDownEvent('k')
    kEvent.metaKey = true
    eventListener(kEvent)
    assert.ok(component.notPressed())
  })

  it('does not skip events for ?', function () {
    const component = new Component()

    addToShortcutScope('global', '?', component)

    const qEvent = new KeyDownEvent('?')
    qEvent.shiftKey = true
    eventListener(qEvent)
    assert.ok(component.pressed())
  })

  it('skips events for editable elements', function () {
    const component = new Component()

    addToShortcutScope('global', 'k', component)

    const kEvent = new KeyDownEvent('k')
    kEvent.target = { isContentEditable: true }
    eventListener(kEvent)
    assert.ok(component.notPressed())
  })

  it('handles multi-key events', function () {
    const a = new Component()
    const ga = new Component()
    const gb = new Component()

    addToShortcutScope('global', 'a', a)
    addToShortcutScope('global', 'g a', ga)
    addToShortcutScope('global', 'g b', gb)

    eventListener(new KeyDownEvent('g'))
    eventListener(new KeyDownEvent('a'))
    assert.ok(ga.pressed())
    assert.ok(gb.notPressed())
    assert.ok(a.notPressed())
  })

  it('falls back to single-key events if no sequence matches', function () {
    const b = new Component()
    const ga = new Component()

    addToShortcutScope('global', 'b', b)
    addToShortcutScope('global', 'g a', ga)

    eventListener(new KeyDownEvent('g'))
    eventListener(new KeyDownEvent('b'))
    assert.ok(b.pressed())
    assert.ok(ga.notPressed())
  })

  it('sends unhandled events to fallback', function () {
    const fallback = new Component()

    addToShortcutScope('global', 'b', new Component())
    addShortcutFallback('global', fallback)

    eventListener(new KeyDownEvent('x'))
    assert.ok(fallback.pressed())
  })

  it('directs events to appropriate component in arbitrary scope', function () {
    const globalB = new Component()
    const inScopeB = new Component()

    addToShortcutScope('global', 'b', globalB)
    addToShortcutScope('inscope', 'b', inScopeB)

    onKeyDownInShortcutScope('inscope', new KeyDownEvent('b'))
    assert.ok(inScopeB.pressed())
    assert.ok(globalB.notPressed())
  })

  it('makes shortcuts modal', function () {
    const globalA = new Component()
    const globalB = new Component()
    const modal1A = new Component()
    const modal2A = new Component()

    addToShortcutScope('global', 'a', globalA)
    addToShortcutScope('global', 'b', globalB)
    addToShortcutScope('modal1', 'a', modal1A)
    addToShortcutScope('modal2', 'a', modal2A)

    pushShortcutScope('modal1')
    pushShortcutScope('modal2')

    eventListener(new KeyDownEvent('b'))
    assert.ok(globalB.notPressed())

    eventListener(new KeyDownEvent('a'))
    assert.ok(globalA.notPressed())
    assert.ok(modal1A.notPressed())
    assert.ok(modal2A.pressed())

    popShortcutScope('modal2')

    eventListener(new KeyDownEvent('a'))
    assert.ok(globalA.notPressed())
    assert.ok(modal1A.pressed())

    popShortcutScope('modal1')

    eventListener(new KeyDownEvent('a'))
    assert.ok(globalA.pressed())
  })

  it('ignores alt key', function () {
    const component = new Component()

    addToShortcutScope('global', '1', component)

    const event = new KeyDownEvent('1')
    event.altKey = true
    eventListener(event)
    assert.ok(component.notPressed())
  })

  it('works with caps lock on', function () {
    const lmn = new Component()

    addToShortcutScope('global', 'z', lmn)

    assert.strictEqual(lmn.eventCount, 0)
    eventListener(new KeyDownEvent('z'))
    assert.strictEqual(lmn.eventCount, 1)
    eventListener(new KeyDownEvent('Z'))
    assert.strictEqual(lmn.eventCount, 2)
  })
})
