import { loginAsFoobar } from '../roles'
import {
  composeInput, getNthComposeReplyButton, getNthComposeReplyInput, getNthReplyButton, getNthStatus, getUrl,
  homeNavButton, notificationsNavButton,
  postStatusButton
} from '../utils'

fixture`103-compose.js`
  .page`http://localhost:4002`

test('statuses show up in home timeline', async t => {
  await loginAsFoobar(t)
  await t
    .typeText(composeInput, 'hello world', { paste: true })
    .click(postStatusButton)
    .expect(getNthStatus(1).innerText).contains('hello world')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthStatus(1).innerText).contains('hello world')
    .navigateTo('/')
    .expect(getNthStatus(1).innerText).contains('hello world')
})

test('statuses in threads show up in right order', async t => {
  await loginAsFoobar(t)
  await t
    .navigateTo('/accounts/5')
    .click(getNthStatus(3))
    .expect(getUrl()).contains('/statuses')
    .click(getNthReplyButton(4))
    .typeText(getNthComposeReplyInput(4), 'my reply!', { paste: true })
    .click(getNthComposeReplyButton(4))
    .expect(getNthComposeReplyInput(4).exists).notOk()
    .expect(getNthStatus(6).innerText).contains('@baz my reply!')
    .navigateTo('/accounts/5')
    .click(getNthStatus(3))
    .expect(getNthStatus(6).innerText).contains('@baz my reply!')
})
