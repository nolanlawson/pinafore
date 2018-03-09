import {
  composeInput, getNthReplyButton,
  getNthStatus, getUrl, goBack
} from '../utils'
import { foobarRole } from '../roles'

fixture`017-compose-reply.js`
  .page`http://localhost:4002`

test('account handle populated correctly for replies', async t => {
  await t.useRole(foobarRole)
    .click(getNthReplyButton(0))
    .expect(getUrl()).contains('/statuses')
    .expect(composeInput.value).eql('@quux ')
    .typeText(composeInput, 'hello quux', {paste: true})
    .expect(composeInput.value).eql('@quux hello quux')
  await goBack()
  await t.click(getNthReplyButton(0))
    .expect(getUrl()).contains('/statuses')
    .expect(composeInput.value).eql('@quux hello quux')
  await goBack()
  await t.expect(getUrl()).eql('http://localhost:4002/')
    .expect(composeInput.value).eql('')
  await t.hover(getNthStatus(2))
    .hover(getNthStatus(4))
    .click(getNthReplyButton(4))
    .expect(getUrl()).contains('/statuses')
    .expect(composeInput.value).eql('')
  await goBack()
  await t.expect(getUrl()).eql('http://localhost:4002/')
    .expect(composeInput.value).eql('')
})

test('replying to posts wth mentions', async t => {
  await t.useRole(foobarRole)
    .click(getNthReplyButton(1))
    .expect(getUrl()).contains('/statuses')
    .expect(composeInput.value).eql('@admin ')
    .navigateTo('/accounts/4')
    .click(getNthReplyButton(0))
    .expect(getUrl()).contains('/statuses')
    .expect(composeInput.value).eql('@ExternalLinks @admin @quux ')
})
