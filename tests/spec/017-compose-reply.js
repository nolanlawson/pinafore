import {
  composeInput,
  getNthComposeReplyInput, getNthPostPrivacyButton, getNthReplyButton,
  getNthStatus, getUrl, homeNavButton, notificationsNavButton
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
