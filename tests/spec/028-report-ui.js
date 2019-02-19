import {
  accountProfileMoreOptionsButton,
  confirmationDialogCancelButton,
  getNthStatusOptionsButton,
  modalDialog
} from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'

fixture`028-report-ui.js`
  .page`http://localhost:4002`

test('Can open a report UI from a status', async t => {
  await loginAsFoobar(t)
  await t
    .click(getNthStatusOptionsButton(0))
    .click($('.modal-dialog button').withText('Report'))
    .expect(modalDialog.innerText).contains('You are reporting @quux')
    .expect(modalDialog.find('.recent-statuses').innerText).contains('pinned toot 2')
    .click(confirmationDialogCancelButton)
    .expect(modalDialog.exists).notOk()
})

test('Can open a report UI from an account', async t => {
  await loginAsFoobar(t)
  await t
    .navigateTo('/accounts/3')
    .click(accountProfileMoreOptionsButton)
    .click($('.modal-dialog button').withText('Report'))
    .expect(modalDialog.innerText).contains('You are reporting @quux')
    .expect(modalDialog.find('.recent-statuses').innerText).contains('pinned toot 2')
    .click(confirmationDialogCancelButton)
    .expect(modalDialog.exists).notOk()
})
