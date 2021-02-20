import { loginAsFoobar } from '../roles'
import {
  displayNameInComposeBox,
  generalSettingsButton,
  getNthStatus,
  getNthStatusSelector,
  getUrl,
  homeNavButton,
  removeEmojiFromDisplayNamesInput,
  settingsNavButton,
  sleep
} from '../utils'
import { postAs, updateUserDisplayNameAs } from '../serverActions'
import { Selector as $ } from 'testcafe'

const rainbow = String.fromCodePoint(0x1F308)

fixture`118-display-name-custom-emoji.js`
  .page`http://localhost:4002`

test('Can put custom emoji in display name', async t => {
  await updateUserDisplayNameAs('foobar', 'foobar :blobpats:')
  await sleep(1000)
  await loginAsFoobar(t)
  await t
    .expect(displayNameInComposeBox.innerText).match(/\s*foobar\s*/)
    .expect($('.compose-box-display-name img').getAttribute('alt')).eql(':blobpats:')
    .click(displayNameInComposeBox)
    .expect(getUrl()).contains('/accounts/2')
    .expect($(`${getNthStatusSelector(1)} .status-author-name img`).getAttribute('alt')).eql(':blobpats:')
})

test('Cannot XSS using display name HTML', async t => {
  await updateUserDisplayNameAs('foobar', '<script>alert("pwn")</script>')
  await sleep(1000)
  await loginAsFoobar(t)
  await t
    .expect(displayNameInComposeBox.innerText).eql('<script>alert("pwn")</script>')
})

test('Can remove emoji from user display names', async t => {
  await updateUserDisplayNameAs('foobar', `${rainbow} foo :blobpats: ${rainbow}`)
  await sleep(1000)
  await loginAsFoobar(t)
  await t
    .expect($('.compose-box-display-name img').exists).ok()
    .expect(displayNameInComposeBox.innerText).eql(`${rainbow} foo  ${rainbow}`)
    .click(settingsNavButton)
    .click(generalSettingsButton)
    .click(removeEmojiFromDisplayNamesInput)
    .expect(removeEmojiFromDisplayNamesInput.checked).ok()
    .click(homeNavButton)
    .expect($('.compose-box-display-name img').exists).notOk()
    .expect(displayNameInComposeBox.innerText).eql('foo')
    .click(settingsNavButton)
    .click(generalSettingsButton)
    .click(removeEmojiFromDisplayNamesInput)
    .expect(removeEmojiFromDisplayNamesInput.checked).notOk()
    .click(homeNavButton)
    .expect($('.compose-box-display-name img').exists).ok()
    .expect(displayNameInComposeBox.innerText).eql(`${rainbow} foo  ${rainbow}`)
})

test('Cannot remove emoji from user display names if result would be empty', async t => {
  await updateUserDisplayNameAs('foobar', `${rainbow} :blobpats: ${rainbow}`)
  await sleep(1000)
  await loginAsFoobar(t)
  await t
    .expect(displayNameInComposeBox.innerText).eql(`${rainbow}  ${rainbow}`)
    .expect($('.compose-box-display-name img').exists).ok()
    .click(settingsNavButton)
    .click(generalSettingsButton)
    .click(removeEmojiFromDisplayNamesInput)
    .expect(removeEmojiFromDisplayNamesInput.checked).ok()
    .click(homeNavButton)
    .expect(displayNameInComposeBox.innerText).eql(`${rainbow}  ${rainbow}`)
    .expect($('.compose-box-display-name img').exists).ok()
    .click(settingsNavButton)
    .click(generalSettingsButton)
    .click(removeEmojiFromDisplayNamesInput)
    .expect(removeEmojiFromDisplayNamesInput.checked).notOk()
    .click(homeNavButton)
    .expect(displayNameInComposeBox.innerText).eql(`${rainbow}  ${rainbow}`)
    .expect($('.compose-box-display-name img').exists).ok()
})

test('Check status aria labels for de-emojified text', async t => {
  await updateUserDisplayNameAs('foobar', `${rainbow} foo :blobpats: ${rainbow}`)
  await postAs('foobar', 'hey ho lotsa emojos')
  await sleep(1000)
  await loginAsFoobar(t)
  await t
    .click(displayNameInComposeBox)
    .expect(getNthStatus(1).getAttribute('aria-label')).match(
      new RegExp(`${rainbow} foo :blobpats: ${rainbow}, hey ho lotsa emojos, (.* ago|just now), @foobar, Public`, 'i')
    )
    .click(settingsNavButton)
    .click(generalSettingsButton)
    .click(removeEmojiFromDisplayNamesInput)
    .expect(removeEmojiFromDisplayNamesInput.checked).ok()
    .click(homeNavButton)
    .click(displayNameInComposeBox)
    .expect(getNthStatus(1).getAttribute('aria-label')).match(
      // eslint-disable-next-line prefer-regex-literals
      new RegExp('foo, hey ho lotsa emojos, (.* ago|just now), @foobar, Public', 'i')
    )
    .click(settingsNavButton)
    .click(generalSettingsButton)
    .click(removeEmojiFromDisplayNamesInput)
    .expect(removeEmojiFromDisplayNamesInput.checked).notOk()
    .click(homeNavButton)
    .click(displayNameInComposeBox)
    .expect(getNthStatus(1).getAttribute('aria-label')).match(
      new RegExp(`${rainbow} foo :blobpats: ${rainbow}, hey ho lotsa emojos, (.* ago|just now), @foobar, Public`, 'i')
    )
})

test('Check some odd emoji', async t => {
  await updateUserDisplayNameAs('foobar', 'foo 🕹📺')
  await sleep(1000)
  await loginAsFoobar(t)
  await t
    .expect(displayNameInComposeBox.innerText).eql('foo 🕹📺')
    .click(settingsNavButton)
    .click(generalSettingsButton)
    .click(removeEmojiFromDisplayNamesInput)
    .expect(removeEmojiFromDisplayNamesInput.checked).ok()
    .click(homeNavButton)
    .expect(displayNameInComposeBox.innerText).eql('foo')
    .click(settingsNavButton)
    .click(generalSettingsButton)
    .click(removeEmojiFromDisplayNamesInput)
    .expect(removeEmojiFromDisplayNamesInput.checked).notOk()
    .click(homeNavButton)
    .expect(displayNameInComposeBox.innerText).eql('foo 🕹📺')

  // clean up after all these tests are done
  await updateUserDisplayNameAs('foobar', 'foobar')
})
