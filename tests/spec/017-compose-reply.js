import {
  composeInput,
  getNthComposeReplyInput, getNthReplyButton,
  getNthStatus, getUrl, goBack, homeNavButton, notificationsNavButton
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
