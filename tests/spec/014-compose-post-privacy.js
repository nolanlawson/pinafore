import {
  composeButton,
  composeModalPostPrivacyButton,
  getNthPostPrivacyOptionInDialog,
  postPrivacyButton, postPrivacyDialogButtonUnlisted,
  scrollToStatus,
  sleep
} from '../utils'
import { loginAsFoobar } from '../roles'

fixture`014-compose-post-privacy.js`
  .page`http://localhost:4002`

test('Changes post privacy', async t => {
  await loginAsFoobar(t)
  await sleep(2000)
  await t
    .expect(postPrivacyButton.getAttribute('aria-label')).eql('Adjust privacy (currently Public)')
    .click(postPrivacyButton)
    .expect(getNthPostPrivacyOptionInDialog(2).exists).ok({ timeout: 30000 })
    .click(getNthPostPrivacyOptionInDialog(2))
    .expect(postPrivacyButton.getAttribute('aria-label')).eql('Adjust privacy (currently Unlisted)')
    .click(postPrivacyButton)
    .expect(getNthPostPrivacyOptionInDialog(1).exists).ok({ timeout: 30000 })
    .click(getNthPostPrivacyOptionInDialog(1))
    .expect(postPrivacyButton.getAttribute('aria-label')).eql('Adjust privacy (currently Public)')
})

test('can use privacy dialog within compose dialog', async t => {
  await loginAsFoobar(t)
  await scrollToStatus(t, 16)
  await t.expect(composeButton.getAttribute('aria-label')).eql('Compose toot')
  await sleep(2000)
  await t.click(composeButton)
    .click(composeModalPostPrivacyButton)
    .click(postPrivacyDialogButtonUnlisted)
    .expect(composeModalPostPrivacyButton.getAttribute('aria-label')).eql('Adjust privacy (currently Unlisted)')
})
