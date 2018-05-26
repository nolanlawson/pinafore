import { getNthStatus } from '../utils'
import { loginAsFoobar } from '../roles'

fixture`005-status-types.js`
  .page`http://localhost:4002`

test('shows direct vs followers-only vs regular', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getNthStatus(1).getAttribute('aria-label')).eql('Status by admin')
    .expect(getNthStatus(1).find('.status-content').innerText).contains('notification of unlisted message')
    .expect(getNthStatus(1).find('.status-toolbar button:nth-child(2)').getAttribute('aria-label'))
    .eql('Boost')
    .expect(getNthStatus(1).find('.status-toolbar button:nth-child(2)').hasAttribute('disabled')).notOk()
    .expect(getNthStatus(2).getAttribute('aria-label')).eql('Status by admin')
    .expect(getNthStatus(2).find('.status-content').innerText).contains('notification of followers-only message')
    .expect(getNthStatus(2).find('.status-toolbar button:nth-child(2)').getAttribute('aria-label'))
    .eql('Cannot be boosted because this is followers-only')
    .expect(getNthStatus(2).find('.status-toolbar button:nth-child(2)').hasAttribute('disabled')).ok()
    .expect(getNthStatus(3).getAttribute('aria-label')).eql('Direct message by admin')
    .expect(getNthStatus(3).find('.status-content').innerText).contains('notification of direct message')
    .expect(getNthStatus(3).find('.status-toolbar button:nth-child(2)').getAttribute('aria-label'))
    .eql('Cannot be boosted because this is a direct message')
    .expect(getNthStatus(3).find('.status-toolbar button:nth-child(2)').hasAttribute('disabled')).ok()
})

test('shows direct vs followers-only vs regular in notifications', async t => {
  await loginAsFoobar(t)
  await t
    .navigateTo('/notifications')
    .expect(getNthStatus(2).getAttribute('aria-label')).eql('Status by admin')
    .expect(getNthStatus(2).find('.status-content').innerText).contains('notification of unlisted message')
    .expect(getNthStatus(2).find('.status-toolbar button:nth-child(2)').getAttribute('aria-label'))
    .eql('Boost')
    .expect(getNthStatus(2).find('.status-toolbar button:nth-child(2)').hasAttribute('disabled')).notOk()
    .expect(getNthStatus(3).getAttribute('aria-label')).eql('Status by admin')
    .expect(getNthStatus(3).find('.status-content').innerText).contains('notification of followers-only message')
    .expect(getNthStatus(3).find('.status-toolbar button:nth-child(2)').getAttribute('aria-label'))
    .eql('Cannot be boosted because this is followers-only')
    .expect(getNthStatus(3).find('.status-toolbar button:nth-child(2)').hasAttribute('disabled')).ok()
    .expect(getNthStatus(4).getAttribute('aria-label')).eql('Direct message by admin')
    .expect(getNthStatus(4).find('.status-content').innerText).contains('notification of direct message')
    .expect(getNthStatus(4).find('.status-toolbar button:nth-child(2)').getAttribute('aria-label'))
    .eql('Cannot be boosted because this is a direct message')
    .expect(getNthStatus(4).find('.status-toolbar button:nth-child(2)').hasAttribute('disabled')).ok()
})
