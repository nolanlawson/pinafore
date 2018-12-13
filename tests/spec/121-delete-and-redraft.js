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
  getComposeModalNthMediaImg,
  getComposeModalNthMediaAltInput,
  getNthStatusSpoiler,
  composeModalContentWarningInput,
  dialogOptionsOption,
  getNthReplyButton, getNthComposeReplyInput, getNthComposeReplyButton, getUrl
} from '../utils'
import { postAs, postEmptyStatusWithMediaAs, postWithSpoilerAndPrivacyAs } from '../serverActions'

fixture`121-delete-and-redraft.js`
  .page`http://localhost:4002`

test('basic delete and redraft', async t => {
  await postAs('foobar', 'hey ho this is grate')
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(0))
    .expect(getNthStatusContent(0).innerText).contains('hey ho this is grate')
    .click(getNthStatusOptionsButton(0))
    .click(dialogOptionsOption.withText('Delete and redraft'))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(composeModalInput.value).contains('hey ho this is grate')
    .expect(composeModalPostPrivacyButton.getAttribute('aria-label')).eql('Adjust privacy (currently Public)')
    .typeText(composeModalInput, 'hey ho this is great', { replace: true, paste: true })
    .click(composeModalComposeButton)
    .expect(modalDialog.exists).notOk()
    .expect(getNthStatusContent(0).innerText).contains('hey ho this is great')
})

test('image with empty text delete and redraft', async t => {
  await postEmptyStatusWithMediaAs('foobar', 'kitten2.jpg', 'what a kitteh')
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(0))
    .expect(getNthStatusMediaImg(0).getAttribute('alt')).eql('what a kitteh')
    .click(getNthStatusOptionsButton(0))
    .click(dialogOptionsOption.withText('Delete and redraft'))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(composeModalInput.value).eql('')
    .expect(composeModalPostPrivacyButton.getAttribute('aria-label')).eql('Adjust privacy (currently Public)')
    .expect(getComposeModalNthMediaImg(1).getAttribute('alt')).eql('what a kitteh')
    .expect(getComposeModalNthMediaAltInput(1).value).eql('what a kitteh')
    .typeText(composeModalInput, 'I love this kitteh', { replace: true, paste: true })
    .click(composeModalComposeButton)
    .expect(modalDialog.exists).notOk()
    .expect(getNthStatusContent(0).innerText).contains('I love this kitteh')
    .expect(getNthStatusMediaImg(0).getAttribute('alt')).eql('what a kitteh')
})

test('image with no alt delete and redraft', async t => {
  await postEmptyStatusWithMediaAs('foobar', 'kitten3.jpg', '')
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(0))
    .expect(getNthStatusMediaImg(0).getAttribute('alt')).eql('')
    .click(getNthStatusOptionsButton(0))
    .click(dialogOptionsOption.withText('Delete and redraft'))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(composeModalInput.value).eql('')
    .expect(composeModalPostPrivacyButton.getAttribute('aria-label')).eql('Adjust privacy (currently Public)')
    .expect(getComposeModalNthMediaImg(1).getAttribute('alt')).eql('')
    .expect(getComposeModalNthMediaAltInput(1).value).eql('')
    .typeText(composeModalInput, 'oops forgot an alt', { replace: true, paste: true })
    .typeText(getComposeModalNthMediaAltInput(1), 'lovely kitteh', { replace: true, paste: true })
    .click(composeModalComposeButton)
    .expect(modalDialog.exists).notOk()
    .expect(getNthStatusContent(0).innerText).contains('oops forgot an alt')
    .expect(getNthStatusMediaImg(0).getAttribute('alt')).eql('lovely kitteh')
})

test('privacy and spoiler delete and redraft', async t => {
  await postWithSpoilerAndPrivacyAs('foobar', 'this is hidden', 'click to see!', 'private')
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(0))
    .expect(getNthStatusSpoiler(0).innerText).contains('click to see!')
    .click(getNthStatusOptionsButton(0))
    .click(dialogOptionsOption.withText('Delete and redraft'))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(composeModalInput.value).eql('this is hidden')
    .expect(composeModalPostPrivacyButton.getAttribute('aria-label')).eql('Adjust privacy (currently Followers-only)')
    .expect(composeModalContentWarningInput.value).eql('click to see!')
    .typeText(composeModalContentWarningInput, 'no really, you should click this!', { replace: true, paste: true })
    .click(composeModalComposeButton)
    .expect(modalDialog.exists).notOk()
    .expect(getNthStatusSpoiler(0).innerText).contains('no really, you should click this!')
})

test('delete and redraft reply', async t => {
  await postAs('admin', 'hey hello')
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(0))
    .expect(getNthStatusContent(0).innerText).contains('hey hello')
    .click(getNthReplyButton(0))
    .typeText(getNthComposeReplyInput(0), 'hello there admin', { paste: true })
    .click(getNthComposeReplyButton(0))
    .expect(getNthStatus(0).innerText).contains('@admin hello there admin')
    .click(getNthStatusOptionsButton(0))
    .click(dialogOptionsOption.withText('Delete and redraft'))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .typeText(composeModalInput, ' oops forgot to say thank you')
    .click(composeModalComposeButton)
    .expect(modalDialog.exists).notOk()
    .expect(getNthStatusContent(0).innerText).match(/@admin hello there admin\s+oops forgot to say thank you/, {
      timeout: 30000
    })
    .click(getNthStatus(0))
    .expect(getUrl()).match(/statuses/)
    .expect(getNthStatusContent(0).innerText).contains('hey hello')
    .expect(getNthStatusContent(1).innerText).match(/@admin hello there admin\s+oops forgot to say thank you/)
})

test('delete and redraft reply within thread', async t => {
  await postAs('admin', 'this is a thread')
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(0))
    .expect(getNthStatusContent(0).innerText).contains('this is a thread')
    .click(getNthStatus(0))
    .expect(getUrl()).match(/statuses/)
    .expect(getNthStatusContent(0).innerText).contains('this is a thread')
    .click(getNthReplyButton(0))
    .typeText(getNthComposeReplyInput(0), 'heyo', { paste: true })
    .click(getNthComposeReplyButton(0))
    .expect(getNthStatus(1).innerText).contains('@admin heyo')
    .click(getNthStatusOptionsButton(1))
    .click(dialogOptionsOption.withText('Delete and redraft'))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .typeText(composeModalInput, ' update!', { paste: true })
    .click(composeModalComposeButton)
    .expect(modalDialog.exists).notOk()
    .expect(getNthStatusContent(1).innerText).match(/@admin heyo\s+update!/, {
      timeout: 30000
    })
    .expect(getNthStatus(2).exists).notOk()
})
