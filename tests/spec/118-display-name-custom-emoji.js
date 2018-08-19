import { loginAsFoobar } from '../roles'
import { displayNameInComposeBox, getNthStatusSelector, getUrl, sleep } from '../utils'
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
