import {
  composeInput, getNthAutosuggestionResult
} from '../utils'
import { foobarRole } from '../roles'

fixture`018-compose-autosuggest.js`
  .page`http://localhost:4002`

test('autosuggests user handles', async t => {
  await t.useRole(foobarRole)
    .hover(composeInput)
    .typeText(composeInput, 'hey @qu')
    .click(getNthAutosuggestionResult(1))
    .expect(composeInput.value).eql('hey @quux ')
    .typeText(composeInput, 'and also @adm')
    .click(getNthAutosuggestionResult(1))
    .expect(composeInput.value).eql('hey @quux and also @admin ')
    .typeText(composeInput, 'and also @AdM')
    .expect(getNthAutosuggestionResult(1).innerText).contains('@admin')
    .pressKey('tab')
    .expect(composeInput.value).eql('hey @quux and also @admin and also @admin ')
    .typeText(composeInput, 'and @QU')
    .expect(getNthAutosuggestionResult(1).innerText).contains('@quux')
    .pressKey('enter')
    .expect(composeInput.value).eql('hey @quux and also @admin and also @admin and @quux ')
})

test('autosuggests custom emoji', async t => {
  await t.useRole(foobarRole)
    .hover(composeInput)
    .typeText(composeInput, ':blob')
    .click(getNthAutosuggestionResult(1))
    .expect(composeInput.value).eql(':blobnom: ')
    .typeText(composeInput, 'and :blob')
    .expect(getNthAutosuggestionResult(1).innerText).contains(':blobnom:')
    .expect(getNthAutosuggestionResult(2).innerText).contains(':blobpats:')
    .expect(getNthAutosuggestionResult(3).innerText).contains(':blobpeek:')
    .pressKey('down')
    .pressKey('down')
    .pressKey('enter')
    .expect(composeInput.value).eql(':blobnom: and :blobpeek: ')
    .typeText(composeInput, 'and also :blobpa')
    .expect(getNthAutosuggestionResult(1).innerText).contains(':blobpats:')
    .pressKey('tab')
    .expect(composeInput.value).eql(':blobnom: and :blobpeek: and also :blobpats: ')
})
