import {
  composeInput, getNthAutosuggestionResult, sleep
} from '../utils'
import { loginAsFoobar } from '../roles'
import { postAs } from '../serverActions'

fixture`131-compose-autosuggest.js`
  .page`http://localhost:4002`

const timeout = 30000

test('autosuggests hashtags', async t => {
  await postAs('admin', 'hello #blank and hello #blanka')
  await sleep(1000)
  await loginAsFoobar(t)
  await t
    .hover(composeInput)
  await sleep(1000)
  await t
    .typeText(composeInput, 'hey #blank')
    .expect(getNthAutosuggestionResult(1).innerText).contains('blank', { timeout })
    .expect(getNthAutosuggestionResult(1).find('.sr-only').innerText).contains('#blank', { timeout })
    .click(getNthAutosuggestionResult(1), { timeout })
    .expect(composeInput.value).eql('hey #blank ')
    .typeText(composeInput, 'and also #blank')
    .click(getNthAutosuggestionResult(1), { timeout })
    .expect(composeInput.value).eql('hey #blank and also #blank ')
    .typeText(composeInput, 'and also #blanka')
    .expect(getNthAutosuggestionResult(1).innerText).contains('blanka', { timeout })
    .pressKey('enter')
    .expect(composeInput.value).eql('hey #blank and also #blank and also #blanka ')
})
