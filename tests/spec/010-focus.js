import {
  getNthStatus, scrollToStatus, closeDialogButton, modalDialogContents, getActiveElementClass, goBack, getUrl,
  goBackButton, getActiveElementInnerText, getNthReplyButton, getActiveElementInsideNthStatus, focus,
  getNthStatusSelector, getActiveElementTagName
} from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'
import { indexWhere } from '../../src/routes/_utils/arrays'
import { homeTimeline } from '../fixtures'

fixture`010-focus.js`
  .page`http://localhost:4002`

test('modal preserves focus', async t => {
  await loginAsFoobar(t)

  let idx = indexWhere(homeTimeline, _ => _.content === "here's a video")

  await scrollToStatus(t, idx)
  // explicitly hover-focus-click
  await t.hover($(`${getNthStatusSelector(idx)} .play-video-button`))
  await focus(`${getNthStatusSelector(idx)} .play-video-button`)()
  await t.click($(`${getNthStatusSelector(idx)} .play-video-button`))
    .click(closeDialogButton)
    .expect(modalDialogContents.exists).notOk()
    .expect(getActiveElementClass()).contains('play-video-button')
    .expect(getActiveElementInsideNthStatus()).eql(idx.toString())
})

test('timeline preserves focus', async t => {
  await loginAsFoobar(t)
  // explicitly hover-focus-click
  await t.hover(getNthStatus(0))
  await focus(getNthStatusSelector(0))()
  await t.click(getNthStatus(0))
    .expect(getUrl()).contains('/statuses/')

  await goBack()
  await t.expect(getUrl()).eql('http://localhost:4002/')
    .expect(getActiveElementClass()).contains('status-article status-in-timeline')
    .expect(getActiveElementInsideNthStatus()).eql('0')
})

test('timeline link preserves focus', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getNthStatus(0).exists).ok({ timeout: 20000 })
    .click($(`${getNthStatusSelector(0)} .status-header a`))
    .expect(getUrl()).contains('/accounts/')
    .click(goBackButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthStatus(0).exists).ok()
    .expect(getActiveElementInnerText()).eql('admin')
    .click($(`${getNthStatusSelector(0)} .status-sidebar`))
    .expect(getUrl()).contains('/accounts/')
    .click(goBackButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getActiveElementClass()).contains('status-sidebar')
    .expect(getActiveElementInsideNthStatus()).eql('0')
})

test('notification timeline preserves focus', async t => {
  await loginAsFoobar(t)
  await t
    .navigateTo('/notifications')
  await scrollToStatus(t, 5)
  await t.click($(`${getNthStatusSelector(5)} .status-header a`))
    .expect(getUrl()).contains('/accounts/')
    .click(goBackButton)
    .expect(getUrl()).eql('http://localhost:4002/notifications')
    .expect(getNthStatus(0).exists).ok()
    .expect(getActiveElementInnerText()).eql('quux')
    .expect(getActiveElementInsideNthStatus()).eql('5')
})

// TODO: this test is really flakey in CI for some reason
test.skip('thread preserves focus', async t => {
  await loginAsFoobar(t)
  await t
    .navigateTo('/accounts/3')
    .hover(getNthStatus(0))
  await scrollToStatus(t, 2)
  await t.click(getNthStatus(2))
    .expect(getUrl()).contains('/statuses/')
    .click($(`${getNthStatusSelector(24)} .status-sidebar`))
    .expect(getUrl()).contains('/accounts/')
    .click(goBackButton)
    .expect(getUrl()).contains('/statuses/')
    .expect(getNthStatus(24).exists).ok()
    .expect(getActiveElementClass()).contains('status-sidebar')
    .expect(getActiveElementInsideNthStatus()).eql('24')
    .hover(getNthStatus(23))
    .click(getNthStatus(23))
    .expect($(`${getNthStatusSelector(23)} .status-absolute-date`).exists).ok()
  await goBack()
  await t.expect($(`${getNthStatusSelector(24)} .status-absolute-date`).exists).ok()
    .expect(getActiveElementClass()).contains('status-article status-in-timeline')
    .expect(getActiveElementInsideNthStatus()).eql('23')
})

test('reply preserves focus and moves focus to the text input', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getNthStatus(1).exists).ok({ timeout: 20000 })
    .click(getNthReplyButton(1))
    .expect(getActiveElementClass()).contains('compose-box-input')
})

test('focus main content element on index page load', async t => {
  await t.expect(getActiveElementTagName()).match(/body/i)
})
