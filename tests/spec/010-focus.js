import {
  getNthStatus,
  scrollToStatus,
  closeDialogButton,
  modalDialogContents,
  goBack,
  getUrl,
  goBackButton,
  getActiveElementInnerText,
  getNthReplyButton,
  getActiveElementInsideNthStatus,
  focus,
  getNthStatusSelector,
  getActiveElementTagName,
  getActiveElementClassList,
  getNthStatusSensitiveMediaButton,
  getActiveElementAriaLabel, settingsNavButton, getActiveElementHref, communityNavButton, getActiveElementId
} from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'

import { homeTimeline } from '../fixtures'

fixture`010-focus.js`
  .page`http://localhost:4002`

test('modal preserves focus', async t => {
  await loginAsFoobar(t)

  const idx = homeTimeline.findIndex(_ => _.content === "here's a video")

  await scrollToStatus(t, 1 + idx)
  // explicitly hover-focus-click
  await t.hover($(`${getNthStatusSelector(1 + idx)} .play-video-button`))
  await focus(`${getNthStatusSelector(1 + idx)} .play-video-button`)()
  await t.click($(`${getNthStatusSelector(1 + idx)} .play-video-button`))
    .click(closeDialogButton)
    .expect(modalDialogContents.exists).notOk()
    .expect(getActiveElementClassList()).contains('play-video-button')
    .expect(getActiveElementInsideNthStatus()).eql((idx + 1).toString())
})

test('timeline preserves focus', async t => {
  await loginAsFoobar(t)
  // explicitly hover-focus-click
  await t.hover(getNthStatus(1))
  await focus(getNthStatusSelector(1))()
  await t.click(getNthStatus(1))
    .expect(getUrl()).contains('/statuses/')

  await goBack()
  await t.expect(getUrl()).eql('http://localhost:4002/')
    .expect(getActiveElementClassList()).contains('status-article')
    .expect(getActiveElementClassList()).contains('status-in-timeline')
    .expect(getActiveElementInsideNthStatus()).eql('1')
})

test('timeline link preserves focus', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getNthStatus(1).exists).ok({ timeout: 20000 })
    .click($(`${getNthStatusSelector(1)} .status-header-author`))
    .expect(getUrl()).contains('/accounts/')
    .click(goBackButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthStatus(1).exists).ok()
    .expect(getActiveElementInnerText()).eql('admin')
    .click($(`${getNthStatusSelector(1)} .status-sidebar`))
    .expect(getUrl()).contains('/accounts/')
    .click(goBackButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getActiveElementClassList()).contains('status-sidebar')
    .expect(getActiveElementInsideNthStatus()).eql('1')
})

test('timeline link preserves focus - reblogger avatar', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getNthStatus(1).exists).ok({ timeout: 20000 })

  const avatar = `${getNthStatusSelector(1)} .status-header-avatar a`
  const id = await $(avatar).getAttribute('id')
  await t
    .click($(avatar))
    .expect(getUrl()).contains('/accounts/')
    .click(goBackButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthStatus(1).exists).ok()
    .expect(getActiveElementId()).eql(id)
})

test('notification timeline preserves focus', async t => {
  await loginAsFoobar(t)
  await t
    .navigateTo('/notifications')
  await scrollToStatus(t, 6)
  await t.click($(`${getNthStatusSelector(6)} .status-header-author`))
    .expect(getUrl()).contains('/accounts/')
    .click(goBackButton)
    .expect(getUrl()).contains('/notifications')
    .expect(getNthStatus(1).exists).ok()
    .expect(getActiveElementInnerText()).eql('quux')
    .expect(getActiveElementInsideNthStatus()).eql('6')
})

test('thread preserves focus', async t => {
  const timeout = 30000

  await loginAsFoobar(t)
  await t
    .navigateTo('/accounts/3')
    .expect(getNthStatus(1).exists).ok({ timeout })
    .hover(getNthStatus(1))
  await scrollToStatus(t, 3)
  await t.click(getNthStatus(3))
    .expect(getUrl()).contains('/statuses/')
    .click($(`${getNthStatusSelector(25)} .status-sidebar`))
    .expect(getUrl()).contains('/accounts/')
    .click(goBackButton)
    .expect(getUrl()).contains('/statuses/')
    .expect(getNthStatus(25).exists).ok()
    .expect(getActiveElementClassList()).contains('status-sidebar')
    .expect(getActiveElementInsideNthStatus()).eql('25')
    .hover(getNthStatus(24))
    .click(getNthStatus(24))
    .expect($(`${getNthStatusSelector(24)} .status-absolute-date`).exists).ok({ timeout })
  await goBack()
  await t.expect($(`${getNthStatusSelector(25)} .status-absolute-date`).exists).ok({ timeout })
    .expect(getActiveElementClassList()).contains('status-article', { timeout })
    .expect(getActiveElementClassList()).contains('status-in-timeline', { timeout })
    .expect(getActiveElementInsideNthStatus()).eql('24', { timeout })
})

test('reply preserves focus and moves focus to the text input', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getNthStatus(2).exists).ok({ timeout: 20000 })
    .click(getNthReplyButton(2))
    .expect(getActiveElementClassList()).contains('compose-box-input')
})

test('focus main content element on index page load', async t => {
  await t.expect(getActiveElementTagName()).match(/body/i)
})

test('clicking sensitive button returns focus to sensitive button', async t => {
  await loginAsFoobar(t)
  const sensitiveKittenIdx = homeTimeline.findIndex(_ => _.spoiler === 'kitten CW')
  await scrollToStatus(t, sensitiveKittenIdx + 1)
  await t
    .click(getNthStatusSensitiveMediaButton(sensitiveKittenIdx + 1))
    .expect(getActiveElementAriaLabel()).eql('Hide sensitive media')
    .click(getNthStatusSensitiveMediaButton(sensitiveKittenIdx + 1))
    .expect(getActiveElementAriaLabel()).eql('Show sensitive media')
})

test('preserves focus two levels deep', async t => {
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(1))
    .click($('.status-author-name').withText(('admin')))
    .expect(getUrl()).contains('/accounts/1')
    .click(getNthStatus(1))
    .expect(getUrl()).contains('status')
  await goBack()
  await t
    .expect(getUrl()).contains('/accounts/1')
    .expect(getActiveElementClassList()).contains('status-article')
  await goBack()
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getActiveElementClassList()).contains('status-author-name')
})

test('preserves focus on settings page', async t => {
  await loginAsFoobar(t)
  await t
    .click(settingsNavButton)
    .click($('a[href="/settings/instances"]'))
    .expect(getUrl()).eql('http://localhost:4002/settings/instances')
    .click($('a[href="/settings/instances/add"]'))
    .expect(getUrl()).eql('http://localhost:4002/settings/instances/add')
  await goBack()
  await t
    .expect(getUrl()).eql('http://localhost:4002/settings/instances')
    .expect(getActiveElementHref()).eql('/settings/instances/add')
  await goBack()
  await t
    .expect(getUrl()).eql('http://localhost:4002/settings')
    .expect(getActiveElementHref()).eql('/settings/instances')
    .click($('a[href="/settings/instances"]'))
    .expect(getUrl()).eql('http://localhost:4002/settings/instances')
    .click($('a.settings-nav-item[href="/settings"]'))
    .expect(getUrl()).eql('http://localhost:4002/settings')
  await goBack()
  await t
    .expect(getUrl()).eql('http://localhost:4002/settings/instances')
    .expect(getActiveElementHref()).eql('/settings')
    .expect(getActiveElementClassList()).contains('settings-nav-item')
})

test('preserves focus on community page', async t => {
  await loginAsFoobar(t)
  await t
    .click(communityNavButton)
    .expect(getUrl()).contains('/community')
    .click($('a[href="/federated"]'))
    .expect(getUrl()).contains('/federated')
  await goBack()
  await t
    .expect(getActiveElementHref()).eql('/federated')
})
