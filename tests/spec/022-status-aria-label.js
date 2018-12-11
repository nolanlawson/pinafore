import { loginAsFoobar } from '../roles'
import {
  generalSettingsButton,
  getNthShowOrHideButton,
  getNthStatus, homeNavButton,
  notificationsNavButton,
  scrollToStatus,
  settingsNavButton
} from '../utils'
import { Selector as $ } from 'testcafe'
import { indexWhere } from '../../src/routes/_utils/arrays'
import { homeTimeline } from '../fixtures'

fixture`022-status-aria-label.js`
  .page`http://localhost:4002`

test('basic aria-labels for statuses', async t => {
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(0))
    .expect(getNthStatus(0).getAttribute('aria-label')).match(
      /quux, pinned toot 1, .+ ago, @quux, Unlisted, Boosted by admin/i
    )
    .hover(getNthStatus(0))
    .expect(getNthStatus(1).getAttribute('aria-label')).match(
      /admin, @foobar notification of unlisted message, .* ago, @admin, Unlisted/i
    )
})

test('aria-labels for CWed statuses', async t => {
  await loginAsFoobar(t)
  let kittenIdx = indexWhere(homeTimeline, _ => _.spoiler === 'kitten CW')
  await scrollToStatus(t, kittenIdx)
  await t
    .hover(getNthStatus(kittenIdx))
    .expect(getNthStatus(kittenIdx).getAttribute('aria-label')).match(
      /foobar, Content warning: kitten CW, .* ago, @foobar, Public/i
    )
    .click(getNthShowOrHideButton(kittenIdx))
    .expect(getNthStatus(kittenIdx).getAttribute('aria-label')).match(
      /foobar, here's a kitten with a CW, .* ago, @foobar, Public/i
    )
    .click(getNthShowOrHideButton(kittenIdx))
    .expect(getNthStatus(kittenIdx).getAttribute('aria-label')).match(
      /foobar, Content warning: kitten CW, .* ago, @foobar, Public/i
    )
})

test('aria-labels for notifications', async t => {
  await loginAsFoobar(t)
  await t
    .click(notificationsNavButton)
    .hover(getNthStatus(0))
    .expect(getNthStatus(0).getAttribute('aria-label')).match(
      /admin favorited your status, foobar, this is unlisted, .* ago, @foobar, Unlisted/i
    )
    .hover(getNthStatus(1))
    .expect(getNthStatus(1).getAttribute('aria-label')).match(
      /admin boosted your status, foobar, this is unlisted, .* ago, @foobar, Unlisted/i
    )
    .hover(getNthStatus(2))
    .expect(getNthStatus(2).getAttribute('aria-label')).match(
      /admin, @foobar notification of unlisted message, .* ago, @admin, Unlisted/i
    )
  await scrollToStatus(t, 4)
  await t
    .hover(getNthStatus(4))
    .expect(getNthStatus(4).getAttribute('aria-label')).match(
      /admin, @foobar notification of direct message, .* ago, @admin, Direct/i
    )
  await scrollToStatus(t, 5)
  await t
    .hover(getNthStatus(5))
    .expect(getNthStatus(5).getAttribute('aria-label')).match(
      /quux followed you, @quux/i
    )
})

test('can shorten aria-labels', async t => {
  await loginAsFoobar(t)
  await t
    .click(settingsNavButton)
    .click(generalSettingsButton)
    .click($('#choice-disable-long-aria-labels'))
    .click(homeNavButton)
    .hover(getNthStatus(0))
    .expect(getNthStatus(0).getAttribute('aria-label')).match(
      /Unlisted status by quux/
    )
    .click(settingsNavButton)
    .click(generalSettingsButton)
    .click($('#choice-disable-long-aria-labels'))
    .click(homeNavButton)
    .hover(getNthStatus(0))
    .expect(getNthStatus(0).getAttribute('aria-label')).match(
      /quux, pinned toot 1, .+ ago, @quux, Unlisted, Boosted by admin/i
    )
})
