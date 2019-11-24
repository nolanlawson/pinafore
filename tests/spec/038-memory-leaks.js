import {
  composeInput,
  getNthAutosuggestionResult,
  getNumSyntheticListeners,
  getUrl,
  homeNavButton,
  scrollToStatus,
  scrollToTop,
  settingsNavButton
} from '../utils'
import { loginAsFoobar } from '../roles'

fixture`038-memory-leaks.js`
  .page`http://localhost:4002`

async function goToStartPoint (t) {
  await t
    .click(settingsNavButton)
    .expect(getUrl()).contains('/settings')
}

async function interactAndGoToEndPoint (t) {
  await t
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
  await scrollToStatus(t, 15)
  await scrollToTop()
  await t
    .typeText(composeInput, 'hey @qu')
    .expect(getNthAutosuggestionResult(1).find('.sr-only').innerText).contains('@quux')
    .click(settingsNavButton)
    .expect(getUrl()).contains('/settings')
}

test('Does not leak synthetic listeners', async t => {
  await loginAsFoobar(t)
  await goToStartPoint(t)
  const numSyntheticListeners = await getNumSyntheticListeners()
  await t
    .expect(numSyntheticListeners).typeOf('number')
  await interactAndGoToEndPoint(t)
  await t
    .expect(getNumSyntheticListeners()).eql(numSyntheticListeners)
})
