import {
  composeInput, getActiveElementClass,
  getNthComposeReplyButton,
  getNthComposeReplyInput, getNthReplyButton,
  getNthStatus
} from '../utils'
import { foobarRole } from '../roles'

fixture`111-focus.js`
  .page`http://localhost:4002`

test('replying to a toot returns focus to reply button', async t => {
  await t.useRole(foobarRole)
    .typeText(composeInput, 'I would like, if I may, to take you on a strange journey', {paste: true})
    .pressKey('ctrl+enter')
    .expect(getNthStatus(0).find('.status-content').innerText).contains('I would like, if I may, to take you on a strange journey')
    .click(getNthReplyButton(0))
    .typeText(getNthComposeReplyInput(0), 'How strange was it?', {paste: true})
    .click(getNthComposeReplyButton(0))
    .expect(getActiveElementClass()).contains('status-toolbar-reply-button', {timeout: 20000})
})
