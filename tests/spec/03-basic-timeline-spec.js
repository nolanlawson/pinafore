import { Selector as $ } from 'testcafe'
import { getUrl, login, validateTimeline } from '../utils'
import { homeTimeline, notifications, localTimeline, favorites } from '../fixtures'

fixture `03-basic-timeline-spec.js`
  .page `http://localhost:4002`
  .beforeEach(async t => {
    await login(t, 'foobar@localhost:3000', 'foobarfoobar')
  })

const firstArticle = $('.virtual-list-item[aria-hidden=false] .status-article')

test('Shows the home timeline', async t => {
  await t
    .expect(firstArticle.hasAttribute('aria-setsize')).ok()
    .expect(firstArticle.getAttribute('aria-posinset')).eql('0')

  await validateTimeline(t, homeTimeline)

  await t.expect(firstArticle.getAttribute('aria-setsize')).eql('49')
})

test('Shows notifications', async t => {
  await t.click($('nav a[aria-label=Notifications]'))
    .expect(getUrl()).contains('/notifications')

  await validateTimeline(t, notifications)
})

test('Shows the local timeline', async t => {
  await t.click($('nav a[aria-label=Local]'))
    await t.expect(getUrl()).contains('/local')

  await validateTimeline(t, localTimeline)
})

test('Shows the federated timeline', async t => {
  await t.click($('nav a[aria-label=Community]'))
    .expect(getUrl()).contains('/community')
    .click($('a').withText('Federated'))
    .expect(getUrl()).contains('/federated')

  await validateTimeline(t, localTimeline) // local is same as federated in this case
})

test('Shows favorites', async t => {
  await t.click($('nav a[aria-label=Community]'))
    .expect(getUrl()).contains('/community')
    .click($('a').withText('Favorites'))
    .expect(getUrl()).contains('/favorites')

  await validateTimeline(t, favorites)
})