import { loginAsFoobar } from '../roles'
import {
  displayNameInComposeBox, generalSettingsButton, getNthStatusSelector, getUrl, homeNavButton,
  removeEmojiFromDisplayNamesInput,
  settingsNavButton,
  sleep
} from '../utils'
import { updateUserDisplayNameAs } from '../serverActions'
import { Selector as $ } from 'testcafe'

fixture`118-display-name-custom-emoji.js`
  .page`http://localhost:4002`

test('Can put custom emoji in display name', async t => {
  await updateUserDisplayNameAs('foobar', 'foobar :blobpats:')
  await sleep(1000)
  await loginAsFoobar(t)
  await t
    .expect(displayNameInComposeBox.innerText).eql('foobar ')
    .expect($('.compose-box-display-name img').getAttribute('alt')).eql(':blobpats:')
    .click(displayNameInComposeBox)
    .expect(getUrl()).contains('/accounts/2')
    .expect($(`${getNthStatusSelector(0)} .status-author-name img`).getAttribute('alt')).eql(':blobpats:')
})

test('Cannot XSS using display name HTML', async t => {
  await updateUserDisplayNameAs('foobar', '<script>alert("pwn")</script>')
  await sleep(1000)
  await loginAsFoobar(t)
  await t
    .expect(displayNameInComposeBox.innerText).eql('<script>alert("pwn")</script>')
})

test('Can remove emoji from user display names', async t => {
  await updateUserDisplayNameAs('foobar', '🌈 foo :blobpats: 🌈')
  await sleep(1000)
  await loginAsFoobar(t)
  await t
    .expect(displayNameInComposeBox.innerText).eql('🌈 foo  🌈')
    .expect($('.compose-box-display-name img').exists).ok()
    .click(settingsNavButton)
    .click(generalSettingsButton)
    .click(removeEmojiFromDisplayNamesInput)
    .expect(removeEmojiFromDisplayNamesInput.checked).ok()
    .click(homeNavButton)
    .expect(displayNameInComposeBox.innerText).eql('foo')
    .expect($('.compose-box-display-name img').exists).notOk()
    .click(settingsNavButton)
    .click(generalSettingsButton)
    .click(removeEmojiFromDisplayNamesInput)
    .expect(removeEmojiFromDisplayNamesInput.checked).notOk()
    .click(homeNavButton)
    .expect(displayNameInComposeBox.innerText).eql('🌈 foo  🌈')
    .expect($('.compose-box-display-name img').exists).ok()
})

test('Cannot remove emoji from user display names if result would be empty', async t => {
  await updateUserDisplayNameAs('foobar', '🌈 :blobpats: 🌈')
  await sleep(1000)
  await loginAsFoobar(t)
  await t
    .expect(displayNameInComposeBox.innerText).eql('🌈  🌈')
    .expect($('.compose-box-display-name img').exists).ok()
    .click(settingsNavButton)
    .click(generalSettingsButton)
    .click(removeEmojiFromDisplayNamesInput)
    .expect(removeEmojiFromDisplayNamesInput.checked).ok()
    .click(homeNavButton)
    .expect(displayNameInComposeBox.innerText).eql('🌈  🌈')
    .expect($('.compose-box-display-name img').exists).ok()
    .click(settingsNavButton)
    .click(generalSettingsButton)
    .click(removeEmojiFromDisplayNamesInput)
    .expect(removeEmojiFromDisplayNamesInput.checked).notOk()
    .click(homeNavButton)
    .expect(displayNameInComposeBox.innerText).eql('🌈  🌈')
    .expect($('.compose-box-display-name img').exists).ok()
})
