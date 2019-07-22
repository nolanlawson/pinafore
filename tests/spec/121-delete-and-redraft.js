import { loginAsFoobar } from '../roles'
import {
  composeModalComposeButton,
  getNthStatus,
  getNthStatusContent,
  getNthStatusOptionsButton,
  modalDialog,
  composeModalInput,
  getNthStatusMediaImg,
  composeModalPostPrivacyButton,
  getComposeModalNthMediaAltInput,
  getNthStatusSpoiler,
  composeModalContentWarningInput,
  dialogOptionsOption,
  getNthReplyButton,
  getNthComposeReplyInput,
  getNthComposeReplyButton,
  getUrl,
  sleep,
  getComposeModalNthMediaListItem,
  composePoll,
  pollButton,
  getComposePollNthInput,
  composeButton,
  getNthStatusPollResult,
  getComposePollNthInputInDialog,
  composeInput,
  composePollMultipleChoice,
  composePollMultipleChoiceInDialog,
  composePollExpiry,
  composePollExpiryOption,
  composePollExpiryInDialog
} from '../utils'
import { postAs, postEmptyStatusWithMediaAs, postWithSpoilerAndPrivacyAs } from '../serverActions'
import { POLL_EXPIRY_DEFAULT } from '../../src/routes/_static/polls'

fixture`121-delete-and-redraft.js`
  .page`http://localhost:4002`

test('basic delete and redraft', async t => {
  await postAs('foobar', 'hey ho this is grate')
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(1))
    .expect(getNthStatusContent(1).innerText).contains('hey ho this is grate')
    .click(getNthStatusOptionsButton(1))
    .click(dialogOptionsOption.withText('Delete and redraft'))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(composeModalInput.value).contains('hey ho this is grate')
    .expect(composeModalPostPrivacyButton.getAttribute('aria-label')).eql('Adjust privacy (currently Public)')
    .typeText(composeModalInput, 'hey ho this is great', { replace: true, paste: true })
    .click(composeModalComposeButton)
    .expect(modalDialog.exists).notOk()
    .expect(getNthStatusContent(1).innerText).contains('hey ho this is great')
})

test('image with empty text delete and redraft', async t => {
  await postEmptyStatusWithMediaAs('foobar', 'kitten2.jpg', 'what a kitteh')
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(1))
    .expect(getNthStatusMediaImg(1).getAttribute('alt')).eql('what a kitteh')
    .click(getNthStatusOptionsButton(1))
    .click(dialogOptionsOption.withText('Delete and redraft'))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(composeModalInput.value).eql('')
    .expect(composeModalPostPrivacyButton.getAttribute('aria-label')).eql('Adjust privacy (currently Public)')
    .expect(getComposeModalNthMediaListItem(1).getAttribute('aria-label')).eql('what a kitteh')
    .expect(getComposeModalNthMediaAltInput(1).value).eql('what a kitteh')
    .typeText(composeModalInput, 'I love this kitteh', { replace: true, paste: true })
    .click(composeModalComposeButton)
    .expect(modalDialog.exists).notOk()
    .expect(getNthStatusContent(1).innerText).contains('I love this kitteh')
    .expect(getNthStatusMediaImg(1).getAttribute('alt')).eql('what a kitteh')
})

test('image with no alt delete and redraft', async t => {
  await postEmptyStatusWithMediaAs('foobar', 'kitten3.jpg', '')
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(1))
    .expect(getNthStatusMediaImg(1).getAttribute('alt')).eql('')
    .click(getNthStatusOptionsButton(1))
    .click(dialogOptionsOption.withText('Delete and redraft'))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(composeModalInput.value).eql('')
    .expect(composeModalPostPrivacyButton.getAttribute('aria-label')).eql('Adjust privacy (currently Public)')
    .expect(getComposeModalNthMediaListItem(1).getAttribute('aria-label')).eql('media')
    .expect(getComposeModalNthMediaAltInput(1).value).eql('')
    .typeText(composeModalInput, 'oops forgot an alt', { replace: true, paste: true })
    .typeText(getComposeModalNthMediaAltInput(1), 'lovely kitteh', { replace: true, paste: true })
    .click(composeModalComposeButton)
    .expect(modalDialog.exists).notOk()
    .expect(getNthStatusContent(1).innerText).contains('oops forgot an alt')
    .expect(getNthStatusMediaImg(1).getAttribute('alt')).eql('lovely kitteh')
})

test('privacy and spoiler delete and redraft', async t => {
  await postWithSpoilerAndPrivacyAs('foobar', 'this is hidden', 'click to see!', 'private')
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(1))
    .expect(getNthStatusSpoiler(1).innerText).contains('click to see!')
    .click(getNthStatusOptionsButton(1))
    .click(dialogOptionsOption.withText('Delete and redraft'))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(composeModalInput.value).eql('this is hidden')
    .expect(composeModalPostPrivacyButton.getAttribute('aria-label')).eql('Adjust privacy (currently Followers-only)')
    .expect(composeModalContentWarningInput.value).eql('click to see!')
    .typeText(composeModalContentWarningInput, 'no really, you should click this!', { replace: true, paste: true })
    .click(composeModalComposeButton)
    .expect(modalDialog.exists).notOk()
    .expect(getNthStatusSpoiler(1).innerText).contains('no really, you should click this!')
})

test('delete and redraft reply', async t => {
  await postAs('admin', 'hey hello')
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(1))
    .expect(getNthStatusContent(1).innerText).contains('hey hello')
    .click(getNthReplyButton(1))
    .typeText(getNthComposeReplyInput(1), 'hello there admin', { paste: true })
    .click(getNthComposeReplyButton(1))
    .expect(getNthStatus(1).innerText).contains('@admin hello there admin')
    .click(getNthStatusOptionsButton(1))
    .click(dialogOptionsOption.withText('Delete and redraft'))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .typeText(composeModalInput, ' oops forgot to say thank you')
    .click(composeModalComposeButton)
    .expect(modalDialog.exists).notOk()
    .expect(getNthStatusContent(1).innerText).match(/@admin hello there admin\s+oops forgot to say thank you/, {
      timeout: 30000
    })
    .click(getNthStatus(1))
    .expect(getUrl()).match(/statuses/)
    .expect(getNthStatusContent(1).innerText).contains('hey hello')
    .expect(getNthStatusContent(2).innerText).match(/@admin hello there admin\s+oops forgot to say thank you/)
})

test('delete and redraft reply within thread', async t => {
  await postAs('admin', 'this is a thread')
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(1))
    .expect(getNthStatusContent(1).innerText).contains('this is a thread')
    .click(getNthStatus(1))
    .expect(getUrl()).match(/statuses/)
  await t
    .expect(getNthStatusContent(1).innerText).contains('this is a thread', { timeout: 30000 })
    .click(getNthReplyButton(1))
  await sleep(2000)
  await t
    .typeText(getNthComposeReplyInput(1), 'heyo', { paste: true })
    .click(getNthComposeReplyButton(1))
  await t
    .expect(getNthStatus(2).innerText).contains('@admin heyo', { timeout: 30000 })
    .click(getNthStatusOptionsButton(2))
  await sleep(2000)
  await t
    .click(dialogOptionsOption.withText('Delete and redraft'))
  await t
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk({ timeout: 30000 })
  await sleep(2000)
  await t
    .typeText(composeModalInput, ' update!', { paste: true })
  await sleep(2000)
  await t
    .click(composeModalComposeButton)
  await t
    .expect(modalDialog.exists).notOk({ timeout: 20000 })
    .expect(getNthStatusContent(2).innerText).match(/@admin heyo\s+update!/, {
      timeout: 30000
    })
})

test('multiple paragraphs', async t => {
  const text = 'hey ho\n\ndouble newline!\njust one newline\njust another newline\n\nanother double newline!'
  await postAs('foobar', text)
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(1))
    .expect(getNthStatusContent(1).innerText).contains(text)
    .click(getNthStatusOptionsButton(1))
    .click(dialogOptionsOption.withText('Delete and redraft'))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(composeModalInput.value).eql(text)
    .typeText(composeModalInput, '\n\nwoot', { paste: true })
    .click(composeModalComposeButton)
    .expect(modalDialog.exists).notOk()
    .expect(getNthStatusContent(1).innerText).contains(text + '\n\nwoot')
})

test('delete and redraft polls', async t => {
  await loginAsFoobar(t)
  await t
    .click(pollButton)
    .expect(composePoll.exists).ok()
    .typeText(composeInput, 'I love this poll', { paste: true })
    .typeText(getComposePollNthInput(1), 'foo', { paste: true })
    .typeText(getComposePollNthInput(2), 'bar', { paste: true })
    .click(composePollExpiry)
    .click(composePollExpiryOption.withText('6 hours'))
    .click(composePollMultipleChoice)
  await sleep(1000)
  await t
    .click(composeButton)
    .expect(getNthStatusContent(1).innerText).contains('I love this poll')
    .expect(getNthStatusPollResult(1, 1).innerText).eql('0% foo')
    .expect(getNthStatusPollResult(1, 2).innerText).eql('0% bar')
  await sleep(1000)
  await t
    .click(getNthStatusOptionsButton(1))
    .click(dialogOptionsOption.withText('Delete and redraft'))
    .expect(composeModalInput.value).eql('I love this poll')
    .expect(getComposePollNthInputInDialog(1).value).eql('foo')
    .expect(getComposePollNthInputInDialog(2).value).eql('bar')
    // there is no way to preserve poll expiry unfortunately
    .expect(composePollExpiryInDialog.value).eql(POLL_EXPIRY_DEFAULT.toString())
    .expect(composePollMultipleChoiceInDialog.checked).eql(true)
})
