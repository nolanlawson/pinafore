import {
  getFavoritesCount,
  getNthFavoriteButton, getNthFavorited, getNthStatus, getUrl, homeNavButton, notificationsNavButton,
  scrollToBottom, scrollToTop, sleep
} from '../utils'
import { loginAsFoobar } from '../roles'
import { indexWhere } from '../../src/routes/_utils/arrays'
import { homeTimeline } from '../fixtures'

fixture`100-favorite-unfavorite.js`
  .page`http://localhost:4002`

test('favorites a status', async t => {
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(4))
    .expect(getNthFavorited(4)).eql('false')
    .click(getNthFavoriteButton(4))
    .expect(getNthFavorited(4)).eql('true')

  // scroll down and back up to force an unrender
  await scrollToBottom()
  await sleep(1)
  await scrollToTop()
  await t
    .hover(getNthStatus(4))
    .expect(getNthFavorited(4)).eql('true')
    .click(notificationsNavButton)
    .click(homeNavButton)
    .expect(getNthFavorited(4)).eql('true')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .hover(getNthStatus(4))
    .expect(getNthFavorited(4)).eql('true')
    .click(getNthFavoriteButton(4))
    .expect(getNthFavorited(4)).eql('false')
})

test('unfavorites a status', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getNthFavorited(1)).eql('true')
    .click(getNthFavoriteButton(1))
    .expect(getNthFavorited(1)).eql('false')

  // scroll down and back up to force an unrender
  await scrollToBottom()
  await sleep(1)
  await scrollToTop()
  await t
    .expect(getNthFavorited(1)).eql('false')
    .click(notificationsNavButton)
    .click(homeNavButton)
    .expect(getNthFavorited(1)).eql('false')
    .click(notificationsNavButton)
    .navigateTo('/')
    .expect(getNthFavorited(1)).eql('false')
    .click(getNthFavoriteButton(1))
    .expect(getNthFavorited(1)).eql('true')
})

test('Keeps the correct favorites count', async t => {
  await loginAsFoobar(t)
  let idx = indexWhere(homeTimeline, _ => _.content === 'this is unlisted')
  await t
    .hover(getNthStatus(idx))
    .click(getNthFavoriteButton(idx))
    .expect(getNthFavorited(idx)).eql('true')
    .click(getNthStatus(idx))
    .expect(getUrl()).contains('/status')
    .expect(getNthFavorited(0)).eql('true')
    .expect(getFavoritesCount()).eql(2)
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .hover(getNthStatus(idx))
    .click(getNthFavoriteButton(idx))
    .expect(getNthFavorited(idx)).eql('false')
    .click(getNthStatus(idx))
    .expect(getUrl()).contains('/status')
    .expect(getNthFavorited(0)).eql('false')
    .expect(getFavoritesCount()).eql(1)
})
