import {
  composeInput,
  getNthComposeReplyInput, getNthPostPrivacyButton, getNthPostPrivacyOptionInDialog, getNthReplyButton,
  getNthReplyContentWarningButton,
  getNthReplyContentWarningInput, getNthReplyPostPrivacyButton,
  getNthStatus, getUrl, homeNavButton, notificationsNavButton, scrollToStatus
} from '../utils'
import { foobarRole } from '../roles'

fixture`017-compose-reply.js`
  .page`http://localhost:4002`

test('account handle populated correctly for replies', async t => {
  await t.useRole(foobarRole)
    .click(getNthReplyButton(0))
    .expect(getNthComposeReplyInput(0).value).eql('@quux ')
    .typeText(getNthComposeReplyInput(0), 'hello quux', {paste: true})
    .expect(getNthComposeReplyInput(0).value).eql('@quux hello quux')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .click(homeNavButton)
    .expect(getUrl()).notContains('/notifications')
    .expect(getNthComposeReplyInput(0).value).eql('@quux hello quux')
    .expect(composeInput.value).eql('')
    .hover(getNthStatus(2))
    .hover(getNthStatus(4))
    .click(getNthReplyButton(4))
    .expect(getNthComposeReplyInput(4).value).eql('')
})

test('replying to posts with mentions', async t => {
  await t.useRole(foobarRole)
    .click(getNthReplyButton(1))
    .expect(getNthComposeReplyInput(1).value).eql('@admin ')
    .navigateTo('/accounts/4')
    .click(getNthReplyButton(0))
    .expect(getNthComposeReplyInput(0).value).eql('@ExternalLinks @admin @quux ')
})

test('replies have same privacy as replied-to status by default', async t => {
  await t.useRole(foobarRole)
    .hover(getNthStatus(0))
    .hover(getNthStatus(1))
    .click(getNthReplyButton(1))
    .expect(getNthPostPrivacyButton(1).getAttribute('aria-label')).eql('Adjust privacy (currently Unlisted)')
    .click(getNthReplyButton(1))
    .hover(getNthStatus(2))
    .click(getNthReplyButton(2))
    .expect(getNthPostPrivacyButton(2).getAttribute('aria-label')).eql('Adjust privacy (currently Followers-only)')
    .click(getNthReplyButton(2))
    .hover(getNthStatus(3))
    .click(getNthReplyButton(3))
    .expect(getNthPostPrivacyButton(3).getAttribute('aria-label')).eql('Adjust privacy (currently Direct)')
    .click(getNthReplyButton(3))
    .hover(getNthStatus(4))
    .hover(getNthStatus(5))
    .hover(getNthStatus(6))
    .hover(getNthStatus(7))
    .click(getNthReplyButton(7))
    .expect(getNthPostPrivacyButton(7).getAttribute('aria-label')).eql('Adjust privacy (currently Public)')
    .click(getNthReplyButton(7))
})

test('replies have same CW as replied-to status', async t => {
  await t.useRole(foobarRole)
  await scrollToStatus(t, 7)
  await t.click(getNthReplyButton(7))
    .expect(getNthReplyContentWarningInput(7).value).eql('kitten CW')
    .click(getNthStatus(7))
    .click(getNthReplyButton(0))
    .expect(getNthReplyContentWarningInput(0).value).eql('kitten CW')
})

test('replies save deletions of CW', async t => {
  await t.useRole(foobarRole)
  await scrollToStatus(t, 7)
  await t.click(getNthReplyButton(7))
    .expect(getNthReplyContentWarningInput(7).value).eql('kitten CW')
    .click(getNthReplyContentWarningButton(7))
    .expect(getNthReplyContentWarningInput(7).exists).notOk()
    .click(getNthStatus(7))
    .click(getNthReplyButton(0))
    .expect(getNthReplyContentWarningInput(0).exists).notOk()
})

test('replies save changes to CW', async t => {
  await t.useRole(foobarRole)
  await scrollToStatus(t, 7)
  await t.click(getNthReplyButton(7))
    .expect(getNthReplyContentWarningInput(7).value).eql('kitten CW')
    .typeText(getNthReplyContentWarningInput(7), ' yolo', {paste: true})
    .expect(getNthReplyContentWarningInput(7).value).eql('kitten CW yolo')
    .click(getNthStatus(7))
    .click(getNthReplyButton(0))
    .expect(getNthReplyContentWarningInput(0).value).eql('kitten CW yolo')
})

test('replies save changes to post privacy', async t => {
  await t.useRole(foobarRole)
    .hover(getNthStatus(0))
    .hover(getNthStatus(1))
    .click(getNthReplyButton(1))
    .expect(getNthPostPrivacyButton(1).getAttribute('aria-label')).eql('Adjust privacy (currently Unlisted)')
    .click(getNthReplyPostPrivacyButton(1))
    .click(getNthPostPrivacyOptionInDialog(1))
    .expect(getNthPostPrivacyButton(1).getAttribute('aria-label')).eql('Adjust privacy (currently Public)')
    .click(getNthStatus(1))
    .click(getNthReplyButton(0))
    .expect(getNthPostPrivacyButton(0).getAttribute('aria-label')).eql('Adjust privacy (currently Unlisted)')
})
