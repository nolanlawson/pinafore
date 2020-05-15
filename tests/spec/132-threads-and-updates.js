import { favoriteStatusAs, postAs, postReplyAs, reblogStatusAs } from '../serverActions'
import { loginAsFoobar } from '../roles'
import {
  getAriaSetSize,
  getFavoritesCount,
  getNthStatus,
  getNthStatusContent,
  getReblogsCount,
  getUrl,
  goBack, scrollToStatus,
  sleep, validateTimeline
} from '../utils'

fixture`132-threads-and-updates.js`
  .page`http://localhost:4002`

test('thread for a status that is not cached locally', async t => {
  const { id: statusId } = await postAs('baz', 'yo here is a post you have never seen before')
  await postReplyAs('baz', 'yep you have never seen this', statusId)
  await loginAsFoobar(t)
  await t
    .navigateTo(`/statuses/${statusId}`)
    .expect(getNthStatusContent(1).innerText).contains('you have never seen before')
    .expect(getNthStatusContent(2).innerText).contains('yep you have never')
})

test('thread for a reply that is not cached locally', async t => {
  const { id: statusId } = await postAs('baz', 'number one')
  const { id: replyId } = await postReplyAs('baz', 'number two', statusId)
  await loginAsFoobar(t)
  await t
    .navigateTo(`/statuses/${replyId}`)
    .expect(getNthStatusContent(1).innerText).contains('number one')
    .expect(getNthStatusContent(2).innerText).contains('number two')
})

test('thread for a status that is cached but the rest is not', async t => {
  const { id: id1 } = await postAs('foobar', 'post number one')
  const { id: id2 } = await postReplyAs('baz', 'post number two', id1)
  await postReplyAs('baz', 'post number three', id2)
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusContent(1).innerText).contains('post number one')
    .click(getNthStatus(1))
    .expect(getUrl()).contains('/statuses')
    .expect(getNthStatusContent(1).innerText).contains('post number one')
    .expect(getNthStatusContent(2).innerText).contains('post number two')
    .expect(getNthStatusContent(3).innerText).contains('post number three')
})

test('thread for a reply that is cached but the rest is not', async t => {
  const { id: id1 } = await postAs('baz', 'post number one')
  const { id: id2 } = await postReplyAs('baz', 'post number two', id1)
  await postReplyAs('foobar', 'post number three', id2)
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusContent(1).innerText).contains('post number three')
    .click(getNthStatus(1))
    .expect(getUrl()).contains('/statuses')
    .expect(getNthStatusContent(1).innerText).contains('post number one')
    .expect(getNthStatusContent(2).innerText).contains('post number two')
    .expect(getNthStatusContent(3).innerText).contains('post number three')
})

test('updates the status fav/reblog count when you click on status', async t => {
  const { id } = await postAs('foobar', 'my happy happy post')
  await loginAsFoobar(t)

  async function assertReblogAndFavCount (reblogs, favs) {
    await t
      .expect(getReblogsCount()).eql(reblogs)
      .expect(getFavoritesCount()).eql(favs)
  }

  await t.click(getNthStatus(1))
  await assertReblogAndFavCount(0, 0)
  await goBack()
  await favoriteStatusAs('baz', id)
  await sleep(1000)
  await t.click(getNthStatus(1))
  await assertReblogAndFavCount(0, 1)
  await goBack()
  await reblogStatusAs('baz', id)
  await sleep(1000)
  await t.click(getNthStatus(1))
  await assertReblogAndFavCount(1, 1)
})

test('updates the thread when you click on status', async t => {
  const { id } = await postAs('foobar', 'my super happy post')
  await loginAsFoobar(t)
  await t
    .click(getNthStatus(1))
    .expect(getAriaSetSize()).eql('1')
  await goBack()
  const { id: id2 } = await postReplyAs('baz', 'that is very happy', id)
  await t
    .click(getNthStatus(1))
    .expect(getAriaSetSize()).eql('2')
    .expect(getNthStatusContent(2).innerText).contains('that is very happy')
  await goBack()
  await postReplyAs('baz', 'that is super duper happy', id2)
  await t
    .click(getNthStatus(1))
    .expect(getAriaSetSize()).eql('3')
    .expect(getNthStatusContent(3).innerText).contains('super duper happy')
  await goBack()
})

test('updates the thread of a reply when you click on it', async t => {
  const { id: id1 } = await postAs('baz', 'uno')
  const { id: id2 } = await postReplyAs('foobar', 'dos', id1)
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusContent(1).innerText).contains('dos')
    .click(getNthStatus(1))
    .expect(getAriaSetSize()).eql('2')
    .expect(getNthStatusContent(1).innerText).contains('uno')
    .expect(getNthStatusContent(2).innerText).contains('dos')
  await goBack()
  const { id: id3 } = await postReplyAs('baz', 'tres', id2)
  await t
    .click(getNthStatus(1))
    .expect(getAriaSetSize()).eql('3')
    .expect(getNthStatusContent(3).innerText).contains('tres')
  await goBack()
  await postReplyAs('baz', 'quatro', id3)
  await t
    .click(getNthStatus(1))
    .expect(getAriaSetSize()).eql('4')
    .expect(getNthStatusContent(4).innerText).contains('quatro')
  await goBack()
})

test('complex thread is in correct order', async t => {
  const { id: a } = await postAs('foobar', 'a')
  const { id: b } = await postReplyAs('baz', 'b', a)
  const { id: c } = await postReplyAs('baz', 'c', b)
  const { id: a1 } = await postReplyAs('baz', 'a1', a)
  const { id: d } = await postReplyAs('baz', 'd', c)
  const { id: a2 } = await postReplyAs('baz', 'a2', a1)
  const { id: b1 } = await postReplyAs('baz', 'b1', b)
  const { id: a3 } = await postReplyAs('baz', 'a3', a2)
  await postReplyAs('baz', 'e', d)
  await postReplyAs('baz', 'b2', b1)
  await postReplyAs('baz', 'a4', a3)
  await postReplyAs('baz', 'a1a', a1)
  await loginAsFoobar(t)
  await t.click(getNthStatus(1))
  const order = 'a b c d e b1 b2 a1 a2 a3 a4 a1a'.split(' ')

  await validateTimeline(t, order.map(content => ({ content })))
})

test('complex thread is in correct order - original poster involved', async t => {
  const { id: a } = await postAs('foobar', 'a-original')
  const { id: b } = await postReplyAs('baz', 'b', a)
  const { id: c } = await postReplyAs('baz', 'c', b)
  const { id: a1 } = await postReplyAs('foobar', 'a1', a)
  const { id: d } = await postReplyAs('baz', 'd', c)
  const { id: a2 } = await postReplyAs('foobar', 'a2', a1)
  const { id: b1 } = await postReplyAs('baz', 'b1', b)
  const { id: a3 } = await postReplyAs('foobar', 'a3', a2)
  await postReplyAs('baz', 'e', d)
  await postReplyAs('baz', 'b2', b1)
  await postReplyAs('foobar', 'a4', a3)
  await postReplyAs('baz', 'a1a', a1)
  await loginAsFoobar(t)
  await scrollToStatus(t, 5)
  await t
    .expect(getNthStatusContent(5).innerText).contains('a-original')
    .click(getNthStatus(5))
  const order = 'a-original a1 a2 a3 a4 b c d e b1 b2 a1a'.split(' ')

  await validateTimeline(t, order.map(content => ({ content })))
})

test('complex thread is in correct order - with ancestors', async t => {
  const { id: ancestor1 } = await postAs('foobar', 'ancestor1')
  const { id: ancestor2 } = await postReplyAs('foobar', 'ancestor2', ancestor1)
  const { id: a } = await postReplyAs('foobar', 'a-root', ancestor2)
  const { id: b } = await postReplyAs('baz', 'b', a)
  const { id: c } = await postReplyAs('baz', 'c', b)
  const { id: a1 } = await postReplyAs('baz', 'a1', a)
  const { id: d } = await postReplyAs('baz', 'd', c)
  const { id: a2 } = await postReplyAs('baz', 'a2', a1)
  const { id: b1 } = await postReplyAs('baz', 'b1', b)
  const { id: a3 } = await postReplyAs('baz', 'a3', a2)
  await postReplyAs('baz', 'e', d)
  await postReplyAs('baz', 'b2', b1)
  await postReplyAs('baz', 'a4', a3)
  await postReplyAs('baz', 'a1a', a1)
  await loginAsFoobar(t)
  await scrollToStatus(t, 5)
  await t
    .expect(getNthStatusContent(1).innerText).contains('a-root')
    .click(getNthStatus(1))
  const order = 'ancestor1 ancestor2 a-root b c d e b1 b2 a1 a2 a3 a4 a1a'.split(' ')

  await validateTimeline(t, order.map(content => ({ content })))
})

test('complex thread is in correct order - with mixed self-replies', async t => {
  const { id: a } = await postAs('foobar', 'a')
  const { id: b } = await postReplyAs('baz', 'b', a)
  const { id: c } = await postReplyAs('baz', 'c', b)
  const { id: a1 } = await postReplyAs('baz', 'a1', a)
  const { id: d } = await postReplyAs('baz', 'd', c)
  const { id: a2 } = await postReplyAs('baz', 'a2', a1)
  const { id: b1 } = await postReplyAs('baz', 'b1', b)
  const { id: a3 } = await postReplyAs('baz', 'a3', a2)
  await postReplyAs('baz', 'e', d)
  await postReplyAs('baz', 'b2', b1)
  await postReplyAs('baz', 'a4', a3)
  await postReplyAs('baz', 'a1a', a1)
  // reply chain: foobar -> foobar -> baz -> foobar -> foobar
  // when foobar replies to itself after replying to baz, is it promoted?
  // see https://github.com/tootsuite/mastodon/pull/9320#issuecomment-440705662
  const { id: mixed1 } = await postReplyAs('foobar', 'foobar-mixed1', a)
  const { id: mixed2 } = await postReplyAs('baz', 'baz-mixed2', mixed1)
  const { id: mixed3 } = await postReplyAs('foobar', 'foobar-mixed3', mixed2)
  await postReplyAs('foobar', 'foobar-mixed4', mixed3)
  await loginAsFoobar(t)
  await t.click(getNthStatus(4))
  const order = 'a foobar-mixed1 b c d e b1 b2 a1 a2 a3 a4 a1a baz-mixed2 foobar-mixed3 foobar-mixed4'.split(' ')

  await validateTimeline(t, order.map(content => ({ content })))
})

test('complex thread is in correct order - with mixed self-replies 2', async t => {
  const { id: a } = await postAs('foobar', 'a')
  const { id: b } = await postReplyAs('baz', 'b', a)
  const { id: c } = await postReplyAs('baz', 'c', b)
  const { id: a1 } = await postReplyAs('baz', 'a1', a)
  const { id: d } = await postReplyAs('baz', 'd', c)
  const { id: a2 } = await postReplyAs('baz', 'a2', a1)
  const { id: b1 } = await postReplyAs('baz', 'b1', b)
  const { id: a3 } = await postReplyAs('baz', 'a3', a2)
  await postReplyAs('baz', 'e', d)
  await postReplyAs('baz', 'b2', b1)
  await postReplyAs('baz', 'a4', a3)
  await postReplyAs('baz', 'a1a', a1)
  // reply chain: foobar -> foobar -> baz -> foobar -> foobar
  // when foobar replies to itself after replying to baz, is it promoted?
  // see https://github.com/tootsuite/mastodon/pull/9320#issuecomment-440705662
  const { id: mixed1 } = await postReplyAs('foobar', 'foobar-mixed1', a)
  const { id: mixed2 } = await postReplyAs('baz', 'baz-mixed2', mixed1)
  const { id: mixed3 } = await postReplyAs('foobar', 'foobar-mixed3', mixed2)
  await postReplyAs('foobar', 'foobar-mixed4', mixed3)
  await postReplyAs('foobar', 'foobar-mixed1a', a)
  await postReplyAs('foobar', 'foobar-mixed1b', a)
  await postReplyAs('foobar', 'foobar-mixed2a', mixed1)
  await loginAsFoobar(t)
  await scrollToStatus(t, 7)
  await t.click(getNthStatus(7))
  const order = ('a foobar-mixed1 foobar-mixed2a foobar-mixed1a foobar-mixed1b ' +
    'b c d e b1 b2 a1 a2 a3 a4 a1a baz-mixed2 foobar-mixed3 foobar-mixed4').split(' ')

  await validateTimeline(t, order.map(content => ({ content })))
})
