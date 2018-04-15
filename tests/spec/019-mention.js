import {
  accountProfileMoreOptionsButton, closeDialogButton,
  getNthDialogOptionsOption, modalDialog
} from '../utils'
import { foobarRole } from '../roles'

fixture`019-mention.js`
  .page`http://localhost:4002`

test('can mention from account profile', async t => {
  await t.useRole(foobarRole)
    .navigateTo('/accounts/5')
    .click(accountProfileMoreOptionsButton)
    .expect(getNthDialogOptionsOption(1).innerText).contains('Mention @baz')
    .click(getNthDialogOptionsOption(1))
    .expect(modalDialog.find('.compose-box-input').value).eql('@baz ')
    .click(closeDialogButton)
    .expect(modalDialog.exists).notOk()
})
