import {
  composeButton,
  getNthStatus,
  scrollToStatus,
  modalDialog,
  sleep,
  notificationsNavButton,
  getUrl,
  getNthStatusSelector,
  composeModalEmojiButton,
  composeModalInput,
  composeModalComposeButton, emojiSearchInput, firstEmojiInPicker
} from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'

fixture`108-compose-dialog.js`
  .page`http://localhost:4002`

test('can compose using a dialog', async t => {
  await loginAsFoobar(t)
  await scrollToStatus(t, 16)
  await t.expect(modalDialog.exists).notOk()
    .expect(composeButton.getAttribute('aria-label')).eql('Compose toot')
  await sleep(2000)
  await t.click(composeButton)
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .typeText(composeModalInput, 'hello from the modal')
    .click(composeModalComposeButton)
    .expect(modalDialog.exists).notOk()
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .navigateTo('/')
    .hover(getNthStatus(1))
    .expect(getNthStatus(1).innerText).contains('hello from the modal', { timeout: 20000 })
})

// Skipped because TestCafé seems to believe the elements are not visible when they are.
// Tested manually and it's fine; probably a TestCafé bug.
test.skip('can use emoji dialog within compose dialog', async t => {
  await loginAsFoobar(t)
  await scrollToStatus(t, 16)
  await t.expect(composeButton.getAttribute('aria-label')).eql('Compose toot')
  await sleep(2000)
  await t.click(composeButton)
  await sleep(1000)
  await t
    .click(composeModalEmojiButton)
  await sleep(1000)
  await t
    .typeText(emojiSearchInput, 'blobpats')
  await sleep(1000)
  await t
    .click(firstEmojiInPicker)
    .expect(composeModalInput.value).eql(':blobpats: ')
    .click(composeModalComposeButton)
    .expect(modalDialog.exists).notOk()
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .navigateTo('/')
  await t.expect($(`${getNthStatusSelector(1)} img[alt=":blobpats:"]`).exists).ok({ timeout: 20000 })
})
