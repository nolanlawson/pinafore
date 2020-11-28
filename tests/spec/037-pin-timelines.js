import {
  communityNavButton, getUrl, goBack, reload
} from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'

fixture`037-pin-timelines.js`
  .page`http://localhost:4002`

test('Can pin a timeline', async t => {
  await loginAsFoobar(t)

  const pinLocal = $('button[aria-label="Pin Local timeline"]')
  const pinFederated = $('button[aria-label="Pin Federated timeline"]')
  const pinnedNav = $('.main-nav-li:nth-child(3)')
  const pinnedNavLink = $('.main-nav-li:nth-child(3) a')

  await t
    .click(communityNavButton)
    .expect(getUrl()).contains('/community')
    .expect(pinLocal.getAttribute('aria-checked')).eql('true')
    .expect(pinFederated.getAttribute('aria-checked')).eql('false')
    .expect(pinnedNavLink.getAttribute('aria-label')).eql('Local')
    .click(pinFederated)
    .expect(pinLocal.getAttribute('aria-checked')).eql('false')
    .expect(pinFederated.getAttribute('aria-checked')).eql('true')
    .expect(pinnedNavLink.getAttribute('aria-label')).eql('Federated')
    .click(pinnedNav)
    .expect(getUrl()).contains('/federated')
  await goBack()
  await t
    .expect(getUrl()).contains('/community')
  await reload()
  await t
    .expect(getUrl()).contains('/community')
    .expect(pinLocal.getAttribute('aria-checked')).eql('false')
    .expect(pinFederated.getAttribute('aria-checked')).eql('true')
})
