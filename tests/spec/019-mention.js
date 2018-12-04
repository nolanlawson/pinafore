import {
  accountProfileMoreOptionsButton, closeDialogButton, composeModalInput,
  getNthDialogOptionsOption, modalDialog
} from '../utils'
import { loginAsFoobar } from '../roles'

fixture`019-mention.js`
  .page`http://localhost:4002`

test('can mention from account profile', async t => {
  await loginAsFoobar(t)
  await t
    .navigateTo('/accounts/5')
    .click(accountProfileMoreOptionsButton)
    .expect(getNthDialogOptionsOption(1).innerText).contains('Mention @baz')
    .click(getNthDialogOptionsOption(1))
    .expect(composeModalInput.value).eql('@baz ')
    .click(closeDialogButton)
    .expect(modalDialog.exists).notOk()
})
