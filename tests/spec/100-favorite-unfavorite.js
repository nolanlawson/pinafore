import {
  getFavoritesCount,
  getNthFavoriteButton,
  getNthFavorited,
  getNthStatus,
  getNthStatusContent,
  getUrl,
  homeNavButton,
  notificationsNavButton,
  scrollToBottom,
  scrollToTop,
  sleep
} from '../utils'
import { loginAsFoobar } from '../roles'
import { favoriteStatusAs, postAs } from '../serverActions'

fixture`100-favorite-unfavorite.js`
  .page`http://localhost:4002`

test('favorites a status', async t => {
  await postAs('admin', 'favorite me!!!')
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusContent(1).innerText).contains('favorite me')
    .hover(getNthStatus(1))
    .expect(getNthFavorited(1)).eql('false')
    .click(getNthFavoriteButton(1))
    .expect(getNthFavorited(1)).eql('true')

  // scroll down and back up to force an unrender
  await scrollToBottom()
  await sleep(1)
  await scrollToTop()
  await t
    .hover(getNthStatus(1))
    .expect(getNthFavorited(1)).eql('true')
    .click(notificationsNavButton)
    .click(homeNavButton)
    .expect(getNthFavorited(1)).eql('true')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .hover(getNthStatus(1))
    .expect(getNthFavorited(1)).eql('true')
    .click(getNthFavoriteButton(1))
    .expect(getNthFavorited(1)).eql('false')
})

test('unfavorites a status', async t => {
  const { id: statusId } = await postAs('admin', 'favorite this one too')
  await favoriteStatusAs('foobar', statusId)
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusContent(1).innerText).contains('favorite this one too')
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
  const { id: statusId } = await postAs('admin', 'favorite this twice pls')
  await favoriteStatusAs('quux', statusId)
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusContent(1).innerText).contains('favorite this twice pls')
    .hover(getNthStatus(1))
    .click(getNthFavoriteButton(1))
    .expect(getNthFavorited(1)).eql('true')
    .click(getNthStatus(1))
    .expect(getUrl()).contains('/status')
    .expect(getNthFavorited(1)).eql('true')
    .expect(getFavoritesCount()).eql(2)
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .hover(getNthStatus(1))
    .click(getNthFavoriteButton(1))
    .expect(getNthFavorited(1)).eql('false')
    .click(getNthStatus(1))
    .expect(getUrl()).contains('/status')
    .expect(getNthFavorited(1)).eql('false')
    .expect(getFavoritesCount()).eql(1)
})
