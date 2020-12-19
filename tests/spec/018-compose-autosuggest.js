import {
  composeInput,
  composeLengthIndicator,
  getNthAutosuggestionResult,
  getNthComposeReplyInput,
  getNthReplyButton,
  getNthStatus,
  sleep
} from '../utils'
import { Selector as $ } from 'testcafe'
import { loginAsFoobar } from '../roles'

fixture`018-compose-autosuggest.js`
  .page`http://localhost:4002`

const timeout = 30000

test('autosuggests user handles', async t => {
  await loginAsFoobar(t)
  await t
    .hover(composeInput)
  await sleep(1000)
  await t
    .typeText(composeInput, 'hey @qu')
    .expect(getNthAutosuggestionResult(1).find('.sr-only').innerText).contains('@quux')
    .click(getNthAutosuggestionResult(1), { timeout })
    .expect(composeInput.value).eql('hey @quux ')
    .typeText(composeInput, 'and also @adm')
    .click(getNthAutosuggestionResult(1), { timeout })
    .expect(composeInput.value).eql('hey @quux and also @admin ')
    .typeText(composeInput, 'and also @AdM')
    .expect(getNthAutosuggestionResult(1).innerText).contains('@admin', { timeout })
    .pressKey('tab')
    .expect(composeInput.value).eql('hey @quux and also @admin and also @admin ')
    .typeText(composeInput, 'and @QU')
    .expect(getNthAutosuggestionResult(1).innerText).contains('@quux', { timeout })
    .pressKey('enter')
    .expect(composeInput.value).eql('hey @quux and also @admin and also @admin and @quux ')
})

test('autosuggests custom emoji', async t => {
  await loginAsFoobar(t)
  await t
    .hover(composeInput)
    .typeText(composeInput, ':blob')
    .click(getNthAutosuggestionResult(1))
    .expect(composeInput.value).eql(':blobnom: ')
    .typeText(composeInput, 'and :blob')
    .expect(getNthAutosuggestionResult(1).find('.sr-only').innerText).contains('blobnom')
    .expect(getNthAutosuggestionResult(1).innerText).contains(':blobnom:', { timeout })
    .expect(getNthAutosuggestionResult(2).innerText).contains(':blobpats:')
    .expect(getNthAutosuggestionResult(3).innerText).contains(':blobpeek:')
    .pressKey('down')
    .pressKey('down')
    .pressKey('enter')
    .expect(composeInput.value).eql(':blobnom: and :blobpeek: ', { timeout })
    .typeText(composeInput, 'and also :blobpa')
    .expect(getNthAutosuggestionResult(1).innerText).contains(':blobpats:', { timeout })
    .pressKey('tab')
    .expect(composeInput.value).eql(':blobnom: and :blobpeek: and also :blobpats: ')
})

test('autosuggest custom emoji works with regular emoji - keyboard', async t => {
  await loginAsFoobar(t)
  await t
    .hover(composeInput)
    .typeText(composeInput, '\ud83c\udf4d :blobno')
    .expect(getNthAutosuggestionResult(1).innerText).contains(':blobnom:', { timeout })
    .pressKey('enter')
    .expect(composeInput.value).eql('\ud83c\udf4d :blobnom: ')
})

test('autosuggest custom emoji works with regular emoji - clicking', async t => {
  await loginAsFoobar(t)
  await t
    .hover(composeInput)
    .typeText(composeInput, '\ud83c\udf4d :blobno')
    .expect(getNthAutosuggestionResult(1).innerText).contains(':blobnom:', { timeout })
    .click(getNthAutosuggestionResult(1))
    .expect(composeInput.value).eql('\ud83c\udf4d :blobnom: ')
})

test('autosuggest handles works with regular emoji - keyboard', async t => {
  await loginAsFoobar(t)
  await t
    .hover(composeInput)
    .typeText(composeInput, '\ud83c\udf4d @quu')
    .expect(getNthAutosuggestionResult(1).innerText).contains('@quux', { timeout })
    .pressKey('enter')
    .expect(composeInput.value).eql('\ud83c\udf4d @quux ')
})

test('autosuggest handles works with regular emoji - clicking', async t => {
  await loginAsFoobar(t)
  await t
    .hover(composeInput)
    .typeText(composeInput, '\ud83c\udf4d @quu')
    .expect(getNthAutosuggestionResult(1).innerText).contains('@quux', { timeout })
    .click(getNthAutosuggestionResult(1))
    .expect(composeInput.value).eql('\ud83c\udf4d @quux ')
})

test('autosuggest can suggest native emoji', async t => {
  await loginAsFoobar(t)
  await t
    .hover(composeInput)
    .typeText(composeInput, ':slight')
    .expect(getNthAutosuggestionResult(1).innerText).contains(':slightly_smiling_face:', { timeout })
    .click(getNthAutosuggestionResult(1))
    .expect(composeInput.value).eql('\ud83d\ude42 ')
})

test('autosuggest only shows for one input', async t => {
  await loginAsFoobar(t)
  await t
    .hover(composeInput)
    .typeText(composeInput, '@quu')
    .hover(getNthStatus(1))
    .click(getNthReplyButton(1))
    .selectText(getNthComposeReplyInput(1))
    .pressKey('delete')
    .typeText(getNthComposeReplyInput(1), 'uu')
    .expect($('.compose-autosuggest').visible).notOk()
})

test('autosuggest only shows for one input part 2', async t => {
  await loginAsFoobar(t)
  await t
    .hover(composeInput)
    .typeText(composeInput, '@adm')
    .expect($('.compose-autosuggest').visible).ok({ timeout })
    .expect(getNthAutosuggestionResult(1).innerText).contains('@admin')
    .hover(getNthStatus(1))
    .click(getNthReplyButton(1))
    .selectText(getNthComposeReplyInput(1))
    .pressKey('delete')
    .typeText(getNthComposeReplyInput(1), '@dd')
  await sleep(1000)
  await t.pressKey('backspace')
    .expect($('.compose-autosuggest').visible).notOk()
})

test('autocomplete disappears on blur', async t => {
  await loginAsFoobar(t)
  await t
    .hover(composeInput)
    .typeText(composeInput, '@adm')
    .expect($('.compose-autosuggest').visible).ok({ timeout })
    .click(composeLengthIndicator)
    .expect($('.compose-autosuggest').visible).notOk()
})
