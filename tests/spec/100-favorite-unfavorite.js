import {
  getFavoritesCount,
  getNthFavoriteButton, getNthFavorited, getNthStatus, getUrl, homeNavButton, notificationsNavButton,
  scrollToBottom, scrollToTop, sleep
} from '../utils'
import { loginAsFoobar } from '../roles'

import { homeTimeline } from '../fixtures'

fixture`100-favorite-unfavorite.js`
  .page`http://localhost:4002`

test('favorites a status', async t => {
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(5))
    .expect(getNthFavorited(5)).eql('false')
    .click(getNthFavoriteButton(5))
    .expect(getNthFavorited(5)).eql('true')

  // scroll down and back up to force an unrender
  await scrollToBottom()
  await sleep(1)
  await scrollToTop()
  await t
    .hover(getNthStatus(5))
    .expect(getNthFavorited(5)).eql('true')
    .click(notificationsNavButton)
    .click(homeNavButton)
    .expect(getNthFavorited(5)).eql('true')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .hover(getNthStatus(5))
    .expect(getNthFavorited(5)).eql('true')
    .click(getNthFavoriteButton(5))
    .expect(getNthFavorited(5)).eql('false')
})

test('unfavorites a status', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getNthFavorited(2)).eql('true')
    .click(getNthFavoriteButton(2))
    .expect(getNthFavorited(2)).eql('false')

  // scroll down and back up to force an unrender
  await scrollToBottom()
  await sleep(1)
  await scrollToTop()
  await t
    .expect(getNthFavorited(2)).eql('false')
    .click(notificationsNavButton)
    .click(homeNavButton)
    .expect(getNthFavorited(2)).eql('false')
    .click(notificationsNavButton)
    .navigateTo('/')
    .expect(getNthFavorited(2)).eql('false')
    .click(getNthFavoriteButton(2))
    .expect(getNthFavorited(2)).eql('true')
})

test('Keeps the correct favorites count', async t => {
  await loginAsFoobar(t)
  let idx = homeTimeline.findIndex(_ => _.content === 'this is unlisted')
  await t
    .hover(getNthStatus(1 + idx))
    .click(getNthFavoriteButton(1 + idx))
    .expect(getNthFavorited(1 + idx)).eql('true')
    .click(getNthStatus(1 + idx))
    .expect(getUrl()).contains('/status')
    .expect(getNthFavorited(1)).eql('true')
    .expect(getFavoritesCount()).eql(2)
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .hover(getNthStatus(1 + idx))
    .click(getNthFavoriteButton(1 + idx))
    .expect(getNthFavorited(1 + idx)).eql('false')
    .click(getNthStatus(1 + idx))
    .expect(getUrl()).contains('/status')
    .expect(getNthFavorited(1)).eql('false')
    .expect(getFavoritesCount()).eql(1)
})
