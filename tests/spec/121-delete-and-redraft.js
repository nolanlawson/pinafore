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
  getComposeModalNthMediaAltInput, getNthStatusSpoiler, composeModalContentWarningInput, dialogOptionsOption
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
