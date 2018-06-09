import {
  composeButton, getNthStatus, scrollToStatus, modalDialog, sleep,
  notificationsNavButton, getUrl, getNthStatusSelector
} from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'

fixture`108-compose-dialog.js`
  .page`http://localhost:4002`

test('can compose using a dialog', async t => {
  await loginAsFoobar(t)
  await scrollToStatus(t, 15)
  await t.expect(modalDialog.exists).notOk()
    .expect(composeButton.getAttribute('aria-label')).eql('Compose')
  await sleep(2000)
  await t.click(composeButton)
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .typeText(modalDialog.find('.compose-box-input'), 'hello from the modal')
    .click(modalDialog.find('.compose-box-button-compose'))
    .expect(modalDialog.exists).notOk()
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .navigateTo('/')
    .hover(getNthStatus(0))
    .expect(getNthStatus(0).innerText).contains('hello from the modal', {timeout: 20000})
})

test('can use emoji dialog within compose dialog', async t => {
  await loginAsFoobar(t)
  await scrollToStatus(t, 15)
  await t.expect(composeButton.getAttribute('aria-label')).eql('Compose')
  await sleep(2000)
  await t.click(composeButton)
    .click(modalDialog.find('.compose-box-toolbar button:nth-child(1)'))
    .click($('button img[title=":blobpats:"]'))
    .expect(modalDialog.find('.compose-box-input').value).eql(':blobpats: ')
    .click(modalDialog.find('.compose-box-button-compose'))
    .expect(modalDialog.exists).notOk()
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .navigateTo('/')
  await t.expect($(`${getNthStatusSelector(0)} img[alt=":blobpats:"]`).exists).ok({timeout: 20000})
})
