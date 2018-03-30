import {
  getNthStatus, scrollToStatus, closeDialogButton, modalDialogContents, getActiveElementClass, goBack, getUrl,
  goBackButton, getActiveElementInnerText, getNthReplyButton, getActiveElementInsideNthStatus
} from '../utils'
import { foobarRole } from '../roles'

fixture`010-focus.js`
  .page`http://localhost:4002`

test('modal preserves focus', async t => {
  await t.useRole(foobarRole)
  await scrollToStatus(t, 9)
  await t.click(getNthStatus(9).find('.play-video-button'))
    .click(closeDialogButton)
    .expect(modalDialogContents.exists).notOk()
    .expect(getActiveElementClass()).contains('play-video-button')
    .expect(getActiveElementInsideNthStatus()).eql('9')
})

test('timeline preserves focus', async t => {
  await t.useRole(foobarRole)
    .click(getNthStatus(0))
    .expect(getUrl()).contains('/statuses/')

  await goBack()
  await t.expect(getUrl()).eql('http://localhost:4002/')
    .expect(getActiveElementClass()).contains('status-article status-in-timeline')
    .expect(getActiveElementInsideNthStatus()).eql('0')
})

test('timeline link preserves focus', async t => {
  await t.useRole(foobarRole)
    .click(getNthStatus(0).find('.status-header a'))
    .expect(getUrl()).contains('/accounts/')
    .click(goBackButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthStatus(0).exists).ok()
    .expect(getActiveElementInnerText()).eql('admin')
    .click(getNthStatus(0).find('.status-sidebar'))
    .expect(getUrl()).contains('/accounts/')
    .click(goBackButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getActiveElementClass()).contains('status-sidebar')
    .expect(getActiveElementInsideNthStatus()).eql('0')
})

test('notification timeline preserves focus', async t => {
  await t.useRole(foobarRole)
    .navigateTo('/notifications')
  await scrollToStatus(t, 5)
  await t.click(getNthStatus(5).find('.status-header a'))
    .expect(getUrl()).contains('/accounts/')
    .click(goBackButton)
    .expect(getUrl()).eql('http://localhost:4002/notifications')
    .expect(getNthStatus(0).exists).ok()
    .expect(getActiveElementInnerText()).eql('quux')
    .expect(getActiveElementInsideNthStatus()).eql('5')
})

test('thread preserves focus', async t => {
  await t.useRole(foobarRole)
    .navigateTo('/accounts/3')
  await scrollToStatus(t, 2)
  await t.click(getNthStatus(2))
    .expect(getUrl()).contains('/statuses/')
    .click(getNthStatus(24).find('.status-sidebar'))
    .expect(getUrl()).contains('/accounts/')
    .click(goBackButton)
    .expect(getUrl()).contains('/statuses/')
    .expect(getNthStatus(24).exists).ok()
    .expect(getActiveElementClass()).contains('status-sidebar')
    .expect(getActiveElementInsideNthStatus()).eql('24')
    .click(getNthStatus(23))
    .expect(getNthStatus(23).find('.status-absolute-date').exists).ok()
  await goBack()
  await t.expect(getNthStatus(24).find('.status-absolute-date').exists).ok()
    .expect(getActiveElementClass()).contains('status-article status-in-timeline')
    .expect(getActiveElementInsideNthStatus()).eql('23')
})

test('reply preserves focus and moves focus to the text input', async t => {
  await t.useRole(foobarRole)
    .click(getNthReplyButton(1))
    .expect(getActiveElementClass()).contains('compose-box-input')
})
