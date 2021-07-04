/* global describe, it */

import assert from 'assert'
import { measureText } from '../../src/routes/_utils/measureText.js'

describe('test-measure-text.js', () => {
  it('measures text correctly', () => {
    assert.deepStrictEqual(measureText(undefined), 0)
    assert.deepStrictEqual(measureText(''), 0)
    assert.deepStrictEqual(measureText('foo'), 3)
    assert.deepStrictEqual(measureText('\ud83c\udf4d\ud83c\udf4d'), 2)
    assert.deepStrictEqual(measureText('hello world http://example.com/super/long/url/that/should/be/shortened'), 70)
    assert.deepStrictEqual(measureText(' @fooooooooooooooooooooooooooooooooooooooooooooooo@example.com '), 51)
    assert.deepStrictEqual(measureText(' @fooooooooooooooooooooooooooooooooooooooooooooooooooo@example.com '), 55)
    assert.deepStrictEqual(measureText(' @fooooooooooooooooooooooooooooooooooooooooooooooo@exaaaaaample.com '), 51)
    assert.deepStrictEqual(measureText(
      'hello world http://example.com/super/long/url/that/should/be/shortened and ' +
      'another url http://example.com/super/long/url/that/should/be/shortened/too'),
    149)
    assert.deepStrictEqual(measureText(
      'hello world http://example.com/super/long/url/that/should/be/shortened and ' +
      'another url http://example.com/super/long/url/that/should/be/shortened/too and' +
      'also a handle @foooooooooooooooooooooooooooooooo@example.com @baaaar@exaaaaaaaaaaample.com and ' +
      '@foooooooooooooooooooooooooo@example.com'),
    242)
  })
})
