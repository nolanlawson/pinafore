/* global it describe */

import assert from 'assert'
import { formatTimeagoDate, formatTimeagoFutureDate } from '../../src/routes/_intl/formatTimeagoDate.js'

describe('test-timeago.js', () => {
  it('test past date', () => {
    const now = Date.now()
    assert.deepStrictEqual(formatTimeagoDate(now, now), 'just now')
    assert.deepStrictEqual(formatTimeagoDate(now - 10 * 1000, now), '10 seconds ago')
    assert.deepStrictEqual(formatTimeagoDate(now - 5 * 60 * 1000, now), '5 minutes ago')
    assert.deepStrictEqual(formatTimeagoDate(now - 3 * 60 * 60 * 1000, now), '3 hours ago')
    assert.deepStrictEqual(formatTimeagoDate(now - 6 * 24 * 60 * 60 * 1000, now), '6 days ago')
    assert.deepStrictEqual(formatTimeagoDate(now - 7 * 24 * 60 * 60 * 1000, now), '1 week ago')
    assert.deepStrictEqual(formatTimeagoDate(now - 4 * 7 * 24 * 60 * 60 * 1000, now), '4 weeks ago')
    assert.deepStrictEqual(formatTimeagoDate(now - 2 * 31 * 24 * 60 * 60 * 1000, now), '2 months ago')
    assert.deepStrictEqual(formatTimeagoDate(now - 365 * 24 * 60 * 60 * 1000, now), '1 year ago')
    assert.deepStrictEqual(formatTimeagoDate(now - 2 * 365 * 24 * 60 * 60 * 1000, now), '2 years ago')
  })

  it('test future date', () => {
    const now = Date.now()
    assert.deepStrictEqual(formatTimeagoFutureDate(now, now), 'just now')
    assert.deepStrictEqual(formatTimeagoFutureDate(now + 10 * 1000, now), 'in 10 seconds')
    assert.deepStrictEqual(formatTimeagoFutureDate(now + 5 * 60 * 1000, now), 'in 5 minutes')
    assert.deepStrictEqual(formatTimeagoFutureDate(now + 3 * 60 * 60 * 1000, now), 'in 3 hours')
    assert.deepStrictEqual(formatTimeagoFutureDate(now + 6 * 24 * 60 * 60 * 1000, now), 'in 6 days')
    assert.deepStrictEqual(formatTimeagoFutureDate(now + 7 * 24 * 60 * 60 * 1000, now), 'in 1 week')
    assert.deepStrictEqual(formatTimeagoFutureDate(now + 4 * 7 * 24 * 60 * 60 * 1000, now), 'in 4 weeks')
    assert.deepStrictEqual(formatTimeagoFutureDate(now + 2 * 31 * 24 * 60 * 60 * 1000, now), 'in 2 months')
    assert.deepStrictEqual(formatTimeagoFutureDate(now + 365 * 24 * 60 * 60 * 1000, now), 'in 1 year')
    assert.deepStrictEqual(formatTimeagoFutureDate(now + 2 * 365 * 24 * 60 * 60 * 1000, now), 'in 2 years')
  })

  it('clamping', () => {
    const now = Date.now()
    assert.deepStrictEqual(formatTimeagoDate(now + 1000000, now), 'just now')
    assert.deepStrictEqual(formatTimeagoFutureDate(now - 1000000, now), 'just now')
  })
})
