/* global describe, it */

import { replaceEmoji } from '../../src/routes/_utils/replaceEmoji.js'
import assert from 'assert'

const mindBlown = String.fromCodePoint(0x1F92F)
const elephant = String.fromCodePoint(0x1F418)
const womanBowing = [0x1f647, 0x200d, 0x2640, 0xfe0f].map(_ => String.fromCodePoint(_)).join('')

describe('test-emoji.js', function () {
  it('does emoji replacement correctly', function () {
    const replacer = _ => `<div>${_}</div>`
    assert.strictEqual(
      replaceEmoji('hello world', replacer),
      'hello world'
    )
    assert.strictEqual(
      replaceEmoji(`${mindBlown}`, replacer),
      `<div>${mindBlown}</div>`
    )
    assert.strictEqual(
      replaceEmoji(`${mindBlown} ${elephant}`, replacer),
      `<div>${mindBlown}</div> <div>${elephant}</div>`
    )
    assert.strictEqual(
      replaceEmoji(`${elephant} woot ${mindBlown}`, replacer),
      `<div>${elephant}</div> woot <div>${mindBlown}</div>`
    )
    assert.strictEqual(
      replaceEmoji(`woot ${mindBlown}`, replacer),
      `woot <div>${mindBlown}</div>`
    )
    assert.strictEqual(
      replaceEmoji(`${mindBlown} woot`, replacer),
      `<div>${mindBlown}</div> woot`
    )
  })

  it('handles multi-code emoji', function () {
    const replacer = _ => `<div>${_}</div>`
    assert.strictEqual(
      replaceEmoji(`hello ${womanBowing}`, replacer),
      `hello <div>${womanBowing}</div>`
    )
  })

  it('handles emoji mixed with custom emoji', function () {
    const replacer = _ => `<div>${_}</div>`
    assert.strictEqual(
      replaceEmoji(`hello ${womanBowing} and :blobpats: and ${elephant}`, replacer),
      `hello <div>${womanBowing}</div> and :blobpats: and <div>${elephant}</div>`
    )
  })

  it('handles sequential emoji', function () {
    const replacer = _ => `<div>${_}</div>`
    assert.strictEqual(
      replaceEmoji(`${elephant}${elephant}${womanBowing}${mindBlown}`, replacer),
      `<div>${elephant}</div><div>${elephant}</div><div>${womanBowing}</div><div>${mindBlown}</div>`
    )
  })

  it('does not replace non-emoji characters', function () {
    const replacer = _ => `<div>${_}</div>`
    assert.strictEqual(
      replaceEmoji('it\'s over #9000', replacer),
      'it\'s over #9000'
    )
    assert.strictEqual(
      replaceEmoji('woot !@#$%^&*()~' + '`' + '{[}]:;"\'<,>.?/£™℠®', replacer),
      'woot !@#$%^&*()~' + '`' + '{[}]:;"\'<,>.?/£™℠®'
    )

    assert.strictEqual(
      replaceEmoji('woot !@#$%^&*()~' + '`' + '{[}]:;"\'<,>.?/£™℠®', replacer),
      'woot !@#$%^&*()~' + '`' + '{[}]:;"\'<,>.?/£™℠®'
    )

    // hidden VARIATION SELECTOR character is in here
    assert.strictEqual(
      replaceEmoji("<p>It's shapes™️ ... continued</p>", replacer),
      "<p>It's shapes™️ ... continued</p>"
    )
  })

  it('does not replace emoji inside HTML tags', function () {
    const replacer = _ => `<div>${_}</div>`
    assert.strictEqual(
      replaceEmoji(`check this cool link: <a href='http://example.com?q=${mindBlown}'>link</a>`, replacer),
      `check this cool link: <a href='http://example.com?q=${mindBlown}'>link</a>`
    )
    assert.strictEqual(
      replaceEmoji(
        `<a href='http://foo.com?q=${mindBlown}'>link</a> and <a href='http://foo.com?q=${mindBlown}'>link</a>`,
        replacer
      ),
      `<a href='http://foo.com?q=${mindBlown}'>link</a> and <a href='http://foo.com?q=${mindBlown}'>link</a>`
    )
    assert.strictEqual(
      replaceEmoji(
        `<a href='http://foo.com?q=${mindBlown}'>link</a> and ${mindBlown}`,
        replacer
      ),
      `<a href='http://foo.com?q=${mindBlown}'>link</a> and <div>${mindBlown}</div>`
    )
    assert.strictEqual(
      replaceEmoji(
        `<a href='http://foo.com?q=${mindBlown}'>link</a> and ${mindBlown} and ` +
        `<a href='http://foo.com?q=${mindBlown}'>link</a>`,
        replacer
      ),
      `<a href='http://foo.com?q=${mindBlown}'>link</a> and <div>${mindBlown}</div> and ` +
      `<a href='http://foo.com?q=${mindBlown}'>link</a>`
    )
  })

  it('removes emoji', function () {
    const replacer = _ => ''
    assert.strictEqual(
      replaceEmoji(`woot ${mindBlown}`, replacer),
      'woot '
    )
    assert.strictEqual(
      replaceEmoji(`woot ${mindBlown} woot`, replacer),
      'woot  woot'
    )
    assert.strictEqual(
      replaceEmoji(`woot ${mindBlown}${elephant}`, replacer),
      'woot '
    )
    assert.strictEqual(
      replaceEmoji(`woot ${mindBlown}${elephant} woot`, replacer),
      'woot  woot'
    )
  })

  it('can handle a dangling left angle bracket for some reason', function () {
    const replacer = _ => `<div>${_}</div>`
    assert.strictEqual(
      replaceEmoji(`woot ${mindBlown} <`, replacer),
      `woot <div>${mindBlown}</div> <`
    )
    assert.strictEqual(
      replaceEmoji(`woot ${mindBlown} <hahahahaha`, replacer),
      `woot <div>${mindBlown}</div> <hahahahaha`
    )
    assert.strictEqual(
      replaceEmoji(`<woot ${mindBlown} <hahahahaha`, replacer),
      `<woot ${mindBlown} <hahahahaha`
    )
  })
})
