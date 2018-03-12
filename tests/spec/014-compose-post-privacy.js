import { postPrivacyButton } from '../utils'
import { foobarRole } from '../roles'

fixture`014-compose-post-privacy.js`
  .page`http://localhost:4002`

test('Changes post privacy', async t => {
  await t.useRole(foobarRole)
    .expect(postPrivacyButton.getAttribute('aria-label')).eql('Adjust privacy (currently Public)')
    .click(postPrivacyButton)
    .click('.generic-dialog-list li:nth-child(2) button')
    .expect(postPrivacyButton.getAttribute('aria-label')).eql('Adjust privacy (currently Unlisted)')
    .click(postPrivacyButton)
    .click('.generic-dialog-list li:nth-child(1) button')
    .expect(postPrivacyButton.getAttribute('aria-label')).eql('Adjust privacy (currently Public)')
})
