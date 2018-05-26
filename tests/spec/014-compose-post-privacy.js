import { getNthPostPrivacyOptionInDialog, postPrivacyButton } from '../utils'
import { loginAsFoobar } from '../roles'

fixture`014-compose-post-privacy.js`
  .page`http://localhost:4002`

test('Changes post privacy', async t => {
  await loginAsFoobar(t)
  await t
    .expect(postPrivacyButton.getAttribute('aria-label')).eql('Adjust privacy (currently Public)')
    .click(postPrivacyButton)
    .click(getNthPostPrivacyOptionInDialog(2))
    .expect(postPrivacyButton.getAttribute('aria-label')).eql('Adjust privacy (currently Unlisted)')
    .click(postPrivacyButton)
    .click(getNthPostPrivacyOptionInDialog(1))
    .expect(postPrivacyButton.getAttribute('aria-label')).eql('Adjust privacy (currently Public)')
})
