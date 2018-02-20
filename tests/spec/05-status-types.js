import { getNthVirtualArticle } from '../utils'
import { foobarRole } from '../roles'

fixture`05-status-types.js`
  .page`http://localhost:4002`

test('shows direct vs followers-only vs regular', async t => {
  await t.useRole(foobarRole)
    .expect(getNthVirtualArticle(1).getAttribute('aria-label')).eql('Status by admin')
    .expect(getNthVirtualArticle(1).find('.status-content').innerText).contains('notification of unlisted message')
    .expect(getNthVirtualArticle(1).find('.status-toolbar button:nth-child(2)').getAttribute('aria-label'))
      .eql('Boost')
    .expect(getNthVirtualArticle(1).find('.status-toolbar button:nth-child(2)').hasAttribute('disabled')).notOk()
    .expect(getNthVirtualArticle(2).getAttribute('aria-label')).eql('Status by admin')
    .expect(getNthVirtualArticle(2).find('.status-content').innerText).contains('notification of followers-only message')
    .expect(getNthVirtualArticle(2).find('.status-toolbar button:nth-child(2)').getAttribute('aria-label'))
      .eql('Cannot be boosted because this is followers-only')
    .expect(getNthVirtualArticle(2).find('.status-toolbar button:nth-child(2)').hasAttribute('disabled')).ok()
    .expect(getNthVirtualArticle(3).getAttribute('aria-label')).eql('Direct message by admin')
    .expect(getNthVirtualArticle(3).find('.status-content').innerText).contains('notification of direct message')
    .expect(getNthVirtualArticle(3).find('.status-toolbar button:nth-child(2)').getAttribute('aria-label'))
      .eql('Cannot be boosted because this is a direct message')
    .expect(getNthVirtualArticle(3).find('.status-toolbar button:nth-child(2)').hasAttribute('disabled')).ok()
})

test('shows direct vs followers-only vs regular in notifications', async t => {
  await t.useRole(foobarRole)
    .navigateTo('/notifications')
    .expect(getNthVirtualArticle(2).getAttribute('aria-label')).eql('Status by admin')
    .expect(getNthVirtualArticle(2).find('.status-content').innerText).contains('notification of unlisted message')
    .expect(getNthVirtualArticle(2).find('.status-toolbar button:nth-child(2)').getAttribute('aria-label'))
    .eql('Boost')
    .expect(getNthVirtualArticle(2).find('.status-toolbar button:nth-child(2)').hasAttribute('disabled')).notOk()
    .expect(getNthVirtualArticle(3).getAttribute('aria-label')).eql('Status by admin')
    .expect(getNthVirtualArticle(3).find('.status-content').innerText).contains('notification of followers-only message')
    .expect(getNthVirtualArticle(3).find('.status-toolbar button:nth-child(2)').getAttribute('aria-label'))
    .eql('Cannot be boosted because this is followers-only')
    .expect(getNthVirtualArticle(3).find('.status-toolbar button:nth-child(2)').hasAttribute('disabled')).ok()
    .expect(getNthVirtualArticle(4).getAttribute('aria-label')).eql('Direct message by admin')
    .expect(getNthVirtualArticle(4).find('.status-content').innerText).contains('notification of direct message')
    .expect(getNthVirtualArticle(4).find('.status-toolbar button:nth-child(2)').getAttribute('aria-label'))
    .eql('Cannot be boosted because this is a direct message')
    .expect(getNthVirtualArticle(4).find('.status-toolbar button:nth-child(2)').hasAttribute('disabled')).ok()
})
