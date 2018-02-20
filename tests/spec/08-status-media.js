import { getNthVirtualArticle } from '../utils'
import { foobarRole } from '../roles'

fixture`08-status-media.js`
  .page`http://localhost:4002`

test('shows sensitive images', async t => {
  await t.useRole(foobarRole)
    .hover(getNthVirtualArticle(3))
    .hover(getNthVirtualArticle(6))
    .hover(getNthVirtualArticle(7))
    .click(getNthVirtualArticle(7).find('.status-sensitive-media-button'))
    .expect(getNthVirtualArticle(7).find('.status-media img').getAttribute('alt')).eql('kitten')
    .expect(getNthVirtualArticle(7).find('.status-media img').hasAttribute('src')).ok()
})
