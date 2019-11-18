import {
  getFavoritesCount,
  getNthFavoriteButton,
  getNthFavoritedLabel,
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
    .expect(getNthFavoritedLabel(1)).eql('Favorite')
    .click(getNthFavoriteButton(1))
    .expect(getNthFavoritedLabel(1)).eql('Unfavorite')

  // scroll down and back up to force an unrender
  await scrollToBottom()
  await sleep(1)
  await scrollToTop()
  await t
    .hover(getNthStatus(1))
    .expect(getNthFavoritedLabel(1)).eql('Unfavorite')
    .click(notificationsNavButton)
    .click(homeNavButton)
    .expect(getNthFavoritedLabel(1)).eql('Unfavorite')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .hover(getNthStatus(1))
    .expect(getNthFavoritedLabel(1)).eql('Unfavorite')
    .click(getNthFavoriteButton(1))
    .expect(getNthFavoritedLabel(1)).eql('Favorite')
})

test('unfavorites a status', async t => {
  const { id: statusId } = await postAs('admin', 'favorite this one too')
  await favoriteStatusAs('foobar', statusId)
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusContent(1).innerText).contains('favorite this one too')
    .expect(getNthFavoritedLabel(1)).eql('Unfavorite')
    .click(getNthFavoriteButton(1))
    .expect(getNthFavoritedLabel(1)).eql('Favorite')

  // scroll down and back up to force an unrender
  await scrollToBottom()
  await sleep(1)
  await scrollToTop()
  await t
    .expect(getNthFavoritedLabel(1)).eql('Favorite')
    .click(notificationsNavButton)
    .click(homeNavButton)
    .expect(getNthFavoritedLabel(1)).eql('Favorite')
    .click(notificationsNavButton)
    .navigateTo('/')
    .expect(getNthFavoritedLabel(1)).eql('Favorite')
    .click(getNthFavoriteButton(1))
    .expect(getNthFavoritedLabel(1)).eql('Unfavorite')
})

test('Keeps the correct favorites count', async t => {
  const { id: statusId } = await postAs('admin', 'favorite this twice pls')
  await favoriteStatusAs('quux', statusId)
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusContent(1).innerText).contains('favorite this twice pls')
    .hover(getNthStatus(1))
    .click(getNthFavoriteButton(1))
    .expect(getNthFavoritedLabel(1)).eql('Unfavorite')
    .click(getNthStatus(1))
    .expect(getUrl()).contains('/status')
    .expect(getNthFavoritedLabel(1)).eql('Unfavorite')
    .expect(getFavoritesCount()).eql(2)
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .hover(getNthStatus(1))
    .click(getNthFavoriteButton(1))
    .expect(getNthFavoritedLabel(1)).eql('Favorite')
    .click(getNthStatus(1))
    .expect(getUrl()).contains('/status')
    .expect(getNthFavoritedLabel(1)).eql('Favorite')
    .expect(getFavoritesCount()).eql(1)
})
