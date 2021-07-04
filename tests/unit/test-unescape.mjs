/* global describe, it */
import assert from 'assert'
import { unescape } from '../../src/routes/_thirdparty/unescape/unescape.js'

describe('test-unescape.js', () => {
  it('unescapes html correctly', () => {
    assert.deepStrictEqual(unescape('What I&#8217;ve learned'), 'What I’ve learned')
    assert.deepStrictEqual(unescape('Hello &#34;world&#34;'), 'Hello "world"')
    assert.deepStrictEqual(unescape('That costs 3&pound; or 4&euro;'), 'That costs 3£ or 4€')
    assert.deepStrictEqual(unescape('That costs 3&POUND; or 4&EURO;'), 'That costs 3&POUND; or 4&EURO;') // must be lc
    assert.deepStrictEqual(unescape('Foo &amp; bar &amp; baz'), 'Foo & bar & baz')
    assert.deepStrictEqual(unescape('Winking tongue: &#128540;'), 'Winking tongue: 😜')
    assert.deepStrictEqual(unescape('Winking tongue as hex: &#x1F61C;'), 'Winking tongue as hex: 😜')
    assert.deepStrictEqual(unescape('Winking tongue as hex: &#x1f61c;'), 'Winking tongue as hex: 😜')
    assert.deepStrictEqual(unescape('All&#039;s fair'), 'All\'s fair')
    assert.deepStrictEqual(unescape('All&apos;s fair'), 'All\'s fair')
    assert.deepStrictEqual(unescape('foo&nbsp;bar'), 'foo bar')
  })

  it('handles fake html code points', () => {
    assert.deepStrictEqual(unescape('Hello &#xFFFFFF;'), 'Hello &#xFFFFFF;')
  })
})
