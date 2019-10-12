import {
  composeInput, getNthAutosuggestionResult, sleep
} from '../utils'
import { loginAsFoobar } from '../roles'
import { postAs } from '../serverActions'

fixture`131-compose-autosuggest.js`
  .page`http://localhost:4002`

const timeout = 30000

test('autosuggests hashtags', async t => {
  await postAs('admin', 'hello #world and hello #wotan')
  await sleep(1000)
  await loginAsFoobar(t)
  await t
    .hover(composeInput)
  await sleep(1000)
  await t
    .typeText(composeInput, 'hey #wo')
    .expect(getNthAutosuggestionResult(1).innerText).contains('world', { timeout })
    .expect(getNthAutosuggestionResult(2).innerText).contains('wotan', { timeout })
    .expect(getNthAutosuggestionResult(1).getAttribute('aria-label')).contains('#world', { timeout })
    .expect(getNthAutosuggestionResult(2).getAttribute('aria-label')).contains('#wotan', { timeout })
    .click(getNthAutosuggestionResult(1), { timeout })
    .expect(composeInput.value).eql('hey #world ')
    .typeText(composeInput, 'and also #WO')
    .click(getNthAutosuggestionResult(1), { timeout })
    .expect(composeInput.value).eql('hey #world and also #world ')
    .typeText(composeInput, 'and also #wot')
    .expect(getNthAutosuggestionResult(1).innerText).contains('wotan', { timeout })
    .pressKey('enter')
    .expect(composeInput.value).eql('hey #world and also #world and also #wotan ')
})
