import {
  composeInput, getActiveElementClass,
  getNthComposeReplyButton,
  getNthComposeReplyInput, getNthReplyButton,
  getNthStatusSelector
} from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'

fixture`111-focus.js`
  .page`http://localhost:4002`

test('replying to a toot returns focus to reply button', async t => {
  await loginAsFoobar(t)
  await t
    .typeText(composeInput, 'I would like, if I may, to take you on a strange journey', { paste: true })
    .pressKey('ctrl+enter')
    .expect($(`${getNthStatusSelector(0)} .status-content`).innerText).contains('I would like, if I may, to take you on a strange journey')
    .click(getNthReplyButton(0))
    .typeText(getNthComposeReplyInput(0), 'How strange was it?', { paste: true })
    .click(getNthComposeReplyButton(0))
    .expect(getActiveElementClass()).contains('status-toolbar-reply-button', { timeout: 20000 })
})
