/* global describe, it */

import { replaceEmoji } from '../../routes/_utils/replaceEmoji'
import assert from 'assert'

describe('unit tests', function () {
  it('does emoji replacement correctly', function () {
    let replacer = _ => `<div>${_}</div>`
    assert.strictEqual(replaceEmoji('hello world', replacer), 'hello world')
    assert.strictEqual(replaceEmoji('🤯🐘‍', replacer), '<div>🤯</div><div>🐘</div>')
  })
})
