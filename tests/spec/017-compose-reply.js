import {
  composeInput,
  getNthComposeReplyInput, getNthPostPrivacyButton, getNthPostPrivacyOptionInDialog, getNthReplyButton,
  getNthReplyContentWarningButton,
  getNthReplyContentWarningInput, getNthReplyPostPrivacyButton,
  getNthStatus, getNthStatusRelativeDate, getUrl, homeNavButton, notificationsNavButton, scrollToStatus
} from '../utils'
import { loginAsFoobar } from '../roles'
import { homeTimeline } from '../fixtures'
import { indexWhere } from '../../src/routes/_utils/arrays'

fixture`017-compose-reply.js`
  .page`http://localhost:4002`

test('account handle populated correctly for replies', async t => {
  await loginAsFoobar(t)
  await t
    .click(getNthReplyButton(1 + 0))
    .expect(getNthComposeReplyInput(1 + 0).value).eql('@quux ')
    .typeText(getNthComposeReplyInput(1 + 0), 'hello quux', { paste: true })
    .expect(getNthComposeReplyInput(1 + 0).value).eql('@quux hello quux')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .click(homeNavButton)
    .expect(getUrl()).notContains('/notifications')
    .expect(getNthComposeReplyInput(1 + 0).value).eql('@quux hello quux')
    .expect(composeInput.value).eql('')
    .hover(getNthStatus(1 + 2))
    .hover(getNthStatus(1 + 4))
    .click(getNthReplyButton(1 + 4))
    .expect(getNthComposeReplyInput(1 + 4).value).eql('')
})

test('replying to posts with mentions', async t => {
  await loginAsFoobar(t)
  await t
    .click(getNthReplyButton(1 + 1))
    .expect(getNthComposeReplyInput(1 + 1).value).eql('@admin ')
    .navigateTo('/accounts/4')
    .click(getNthReplyButton(1 + 0))
    .expect(getNthComposeReplyInput(1 + 0).value).eql('@ExternalLinks @admin @quux ')
})

test('replies have same privacy as replied-to status by default', async t => {
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(1 + 0))
    .hover(getNthStatus(1 + 1))
    .click(getNthReplyButton(1 + 1))
    .expect(getNthPostPrivacyButton(1).getAttribute('aria-label')).eql('Adjust privacy (currently Unlisted)')
    .click(getNthReplyButton(1 + 1))
    .hover(getNthStatus(1 + 2))
    .click(getNthReplyButton(1 + 2))
    .expect(getNthPostPrivacyButton(2).getAttribute('aria-label')).eql('Adjust privacy (currently Followers-only)')
    .click(getNthReplyButton(1 + 2))
    .hover(getNthStatus(1 + 3))
    .hover(getNthStatus(1 + 4))
    .hover(getNthStatus(1 + 5))
    .click(getNthReplyButton(1 + 5))
    .expect(getNthPostPrivacyButton(5).getAttribute('aria-label')).eql('Adjust privacy (currently Public)')
    .click(getNthReplyButton(1 + 5))
})

test('replies have same CW as replied-to status', async t => {
  await loginAsFoobar(t)
  let kittenIdx = indexWhere(homeTimeline, _ => _.spoiler === 'kitten CW')
  await scrollToStatus(t, 1 + kittenIdx)
  await t.click(getNthReplyButton(1 + kittenIdx))
    .expect(getNthReplyContentWarningInput(1 + kittenIdx).value).eql('kitten CW')
    .click(getNthStatusRelativeDate(1 + kittenIdx))
    .expect(getUrl()).contains('/statuses')
    .click(getNthReplyButton(1 + 0))
    .expect(getNthReplyContentWarningInput(1 + 0).value).eql('kitten CW')
})

test('replies save deletions of CW', async t => {
  await loginAsFoobar(t)
  let kittenIdx = indexWhere(homeTimeline, _ => _.spoiler === 'kitten CW')
  await scrollToStatus(t, 1 + kittenIdx)
  await t.click(getNthReplyButton(1 + kittenIdx))
    .expect(getNthReplyContentWarningInput(1 + kittenIdx).value).eql('kitten CW')
    .click(getNthReplyContentWarningButton(1 + kittenIdx))
    .expect(getNthReplyContentWarningInput(1 + kittenIdx).exists).notOk()
    .click(getNthStatusRelativeDate(1 + kittenIdx))
    .expect(getUrl()).contains('/statuses')
    .click(getNthReplyButton(1 + 0))
    .expect(getNthReplyContentWarningInput(1 + 0).exists).notOk()
})

test('replies save changes to CW', async t => {
  await loginAsFoobar(t)
  let kittenIdx = indexWhere(homeTimeline, _ => _.spoiler === 'kitten CW')
  await scrollToStatus(t, 1 + kittenIdx)
  await t.click(getNthReplyButton(1 + kittenIdx))
    .expect(getNthReplyContentWarningInput(1 + kittenIdx).value).eql('kitten CW')
    .typeText(getNthReplyContentWarningInput(1 + kittenIdx), ' yolo', { paste: true })
    .expect(getNthReplyContentWarningInput(1 + kittenIdx).value).eql('kitten CW yolo')
    .click(getNthStatusRelativeDate(1 + kittenIdx))
    .expect(getUrl()).contains('/statuses')
    .click(getNthReplyButton(1 + 0))
    .expect(getNthReplyContentWarningInput(1 + 0).value).eql('kitten CW yolo')
})

test('replies save changes to post privacy', async t => {
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(1 + 0))
    .hover(getNthStatus(1 + 1))
    .click(getNthReplyButton(1 + 1))
    .expect(getNthPostPrivacyButton(1).getAttribute('aria-label')).eql('Adjust privacy (currently Unlisted)')
    .click(getNthReplyPostPrivacyButton(1 + 1))
    .click(getNthPostPrivacyOptionInDialog(1))
    .expect(getNthPostPrivacyButton(1).getAttribute('aria-label')).eql('Adjust privacy (currently Public)')
    .click(getNthStatusRelativeDate(1 + 1))
    .expect(getUrl()).contains('/statuses')
    .click(getNthReplyButton(1 + 0))
    .expect(getNthPostPrivacyButton(0).getAttribute('aria-label')).eql('Adjust privacy (currently Public)')
})

test('replies are the same whatever thread they are in', async t => {
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(1 + 0))
    .hover(getNthStatus(1 + 1))
    .click(getNthReplyButton(1 + 1))
    .typeText(getNthComposeReplyInput(1 + 1), 'this is a reply', { paste: true })
    .expect(getNthComposeReplyInput(1 + 1).value).eql('@admin this is a reply')
    .click(getNthStatusRelativeDate(1 + 1))
    .expect(getUrl()).contains('/statuses')
    .click(getNthReplyButton(1 + 0))
    .expect(getNthComposeReplyInput(1 + 0).value).eql('@admin this is a reply')
})
