import { loginAsFoobar } from '../roles'
import {
  generalSettingsButton,
  getNthShowOrHideButton,
  getNthStatus, getNthStatusAndSensitiveButton, getNthStatusRelativeDateTime, homeNavButton,
  notificationsNavButton,
  scrollToStatus,
  settingsNavButton
} from '../utils'
import { Selector as $ } from 'testcafe'

import { homeTimeline } from '../fixtures'

fixture`022-status-aria-label.js`
  .page`http://localhost:4002`

test('basic aria-labels for statuses', async t => {
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(1))
    .expect(getNthStatus(1).getAttribute('aria-label')).match(
      /quux, pinned toot 1, .+ ago, @quux, Unlisted, Boosted by admin/i
    )
    .expect(getNthStatusRelativeDateTime(1).getAttribute('aria-label')).match(
      /.* ago - click to show thread/i
    )
    .hover(getNthStatus(1))
    .expect(getNthStatus(2).getAttribute('aria-label')).match(
      /admin, @foobar notification of unlisted message, .* ago, @admin, Unlisted/i
    )
})

test('aria-labels for CWed statuses', async t => {
  await loginAsFoobar(t)
  const kittenIdx = homeTimeline.findIndex(_ => _.spoiler === 'kitten CW')
  await scrollToStatus(t, 1 + kittenIdx)
  await t
    .hover(getNthStatus(1 + kittenIdx))
    .expect(getNthStatus(1 + kittenIdx).getAttribute('aria-label')).match(
      /foobar, Content warning: kitten CW, .* ago, @foobar, Public/i
    )
    // toggle the CW button
    .click(getNthShowOrHideButton(1 + kittenIdx))
    .expect(getNthStatus(1 + kittenIdx).getAttribute('aria-label')).match(
      /foobar, here's a kitten with a CW, .* ago, @foobar, Public/i
    )
    .click(getNthShowOrHideButton(1 + kittenIdx))
    .expect(getNthStatus(1 + kittenIdx).getAttribute('aria-label')).match(
      /foobar, Content warning: kitten CW, .* ago, @foobar, Public/i
    )
    // toggle the "show sensitive media" button
    .click(getNthStatusAndSensitiveButton(1 + kittenIdx, 1))
    .expect(getNthStatus(1 + kittenIdx).getAttribute('aria-label')).match(
      /foobar, Content warning: kitten CW, has media, kitten, .* ago, @foobar, Public/i
    )
    .click(getNthStatusAndSensitiveButton(1 + kittenIdx, 1))
    .expect(getNthStatus(1 + kittenIdx).getAttribute('aria-label')).match(
      /foobar, Content warning: kitten CW, .* ago, @foobar, Public/i
    )
})

test('aria-labels for two media attachments', async t => {
  await loginAsFoobar(t)
  const twoKittensIdx = homeTimeline.findIndex(_ => _.content === 'here\'s 2 kitten photos')
  await scrollToStatus(t, 1 + twoKittensIdx)
  await t
    .hover(getNthStatus(1 + twoKittensIdx))
    .expect(getNthStatus(1 + twoKittensIdx).getAttribute('aria-label')).match(
      /foobar, here's 2 kitten photos, has media, kitten, kitten, .* ago, @foobar, Public/i
    )
})

test('aria-labels for notifications', async t => {
  await loginAsFoobar(t)
  await t
    .click(notificationsNavButton)
    .hover(getNthStatus(1))
    .expect(getNthStatus(1).getAttribute('aria-label')).match(
      /admin favorited your toot, foobar, this is unlisted, .* ago, @foobar, Unlisted/i
    )
    .hover(getNthStatus(2))
    .expect(getNthStatus(2).getAttribute('aria-label')).match(
      /admin boosted your toot, foobar, this is unlisted, .* ago, @foobar, Unlisted/i
    )
    .hover(getNthStatus(3))
    .expect(getNthStatus(3).getAttribute('aria-label')).match(
      /admin, @foobar notification of unlisted message, .* ago, @admin, Unlisted/i
    )
  await scrollToStatus(t, 5)
  await t
    .hover(getNthStatus(5))
    .expect(getNthStatus(5).getAttribute('aria-label')).match(
      /admin, @foobar notification of direct message, .* ago, @admin, Direct/i
    )
  await scrollToStatus(t, 6)
  await t
    .hover(getNthStatus(6))
    .expect(getNthStatus(6).getAttribute('aria-label')).match(
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
    .hover(getNthStatus(1))
    .expect(getNthStatus(1).getAttribute('aria-label')).match(
      /Unlisted toot by quux/
    )
    .click(settingsNavButton)
    .click(generalSettingsButton)
    .click($('#choice-disable-long-aria-labels'))
    .click(homeNavButton)
    .hover(getNthStatus(1))
    .expect(getNthStatus(1).getAttribute('aria-label')).match(
      /quux, pinned toot 1, .+ ago, @quux, Unlisted, Boosted by admin/i
    )
})
