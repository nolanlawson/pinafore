import { loginAsFoobar } from '../roles'
import {
  getFavoritesCount,
  getNthStatus, getNthStatusContent, getReblogsCount, homeNavButton
} from '../utils'
import { favoriteStatusAs, postAs, reblogStatusAs } from '../serverActions'

fixture`119-status-counts-update.js`
  .page`http://localhost:4002`

test('Fav stats update', async t => {
  let status = await postAs('foobar', 'hey hello look at this toot')
  let statusId = status.id
  await favoriteStatusAs('admin', statusId)
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusContent(0).innerText).contains('hey hello look at this toot')
    .click(getNthStatus(0))
    .expect(getFavoritesCount()).eql(1)
    .click(homeNavButton)
  await favoriteStatusAs('quux', statusId)
  await t
    .click(getNthStatus(0))
    .expect(getFavoritesCount()).eql(2)
    .click(homeNavButton)
  await favoriteStatusAs('baz', statusId)
  await t
    .click(getNthStatus(0))
    .expect(getFavoritesCount()).eql(3)
    .click(homeNavButton)
  await favoriteStatusAs('LockedAccount', statusId)
  await t
    .click(getNthStatus(0))
    .expect(getFavoritesCount()).eql(4)
})

test('Reblog stats update', async t => {
  let status = await postAs('foobar', 'oh why hello it looks like another toot')
  let statusId = status.id
  await reblogStatusAs('admin', statusId)
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusContent(0).innerText).contains('oh why hello it looks like another toot')
    .click(getNthStatus(0))
    .expect(getReblogsCount()).eql(1)
    .click(homeNavButton)
  await reblogStatusAs('quux', statusId)
  await t
    .click(getNthStatus(0))
    .expect(getReblogsCount()).eql(2)
    .click(homeNavButton)
  await reblogStatusAs('baz', statusId)
  await t
    .click(getNthStatus(0))
    .expect(getReblogsCount()).eql(3)
    .click(homeNavButton)
  await reblogStatusAs('LockedAccount', statusId)
  await t
    .click(getNthStatus(0))
    .expect(getReblogsCount()).eql(4)
})

test('Fav and reblog stats update for a boosted toot', async t => {
  let status = await postAs('ExternalLinks', 'this will get boosted')
  let statusId = status.id
  await reblogStatusAs('admin', statusId)
  await favoriteStatusAs('admin', statusId)
  await favoriteStatusAs('quux', statusId)
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusContent(0).innerText).contains('this will get boosted')
    .click(getNthStatus(0))
    .expect(getReblogsCount()).eql(1)
    .expect(getFavoritesCount()).eql(2)
    .click(homeNavButton)
  await favoriteStatusAs('baz', statusId)
  await t
    .click(getNthStatus(0))
    .expect(getReblogsCount()).eql(1)
    .expect(getFavoritesCount()).eql(3)
    .click(homeNavButton)
  await favoriteStatusAs('LockedAccount', statusId)
  await t
    .click(getNthStatus(0))
    .expect(getReblogsCount()).eql(1)
    .expect(getFavoritesCount()).eql(4)
})
