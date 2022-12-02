import { Selector as $ } from 'testcafe'
import { loginAsFoobar } from '../roles'
import { createWordFilterAs, deleteAllWordFiltersAs, postAs, reblogStatusAs } from '../serverActions'
import { WORD_FILTER_CONTEXT_NOTIFICATIONS, WORD_FILTER_CONTEXTS } from '../../src/routes/_static/wordFilters'
import {
  getNthStatusContent, getUrl,
  homeNavButton,
  modalDialog,
  notificationsNavButton,
  settingsNavButton,
  sleep
} from '../utils'

fixture`138-word-filters.js`
  .page`http://localhost:4002`
  .afterEach(async () => {
    await deleteAllWordFiltersAs('foobar')
  })

const goToWordFilterSettings = async t => {
  await t
    .click(settingsNavButton)
    .click($('a').withText('Instances'))
    .click($('a').withText('localhost:3000'))
    .hover($('h2').withText('Word filters'))
}

const addFilter = async (t, phrase, tweak) => {
  await t
    .click($('button').withText('Add filter'))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .typeText($('input[type=text]#word-filter-word-or-phrase'), phrase)
  if (tweak) {
    await tweak(t)
  }
  await t
    .click($('button').withText('Save'))
    .expect(modalDialog.exists).notOk()
}

// TODO: test broken by Mastodon v4 bug https://github.com/mastodon/mastodon/issues/21965
test.skip('Can filter basic words', async t => {
  await postAs('admin', 'do not filter me!')
  await postAs('admin', 'filterMeOut okay!')
  await postAs('admin', 'filterMeOutTooEvenThoughItIsOneBigWord!')
  await sleep(500)
  await loginAsFoobar(t)
  await goToWordFilterSettings(t)
  await addFilter(t, 'filterMeOut', async t => {
    // uncheck "whole word"
    await t
      .click($('input#word-filter-whole'))
    await sleep(500)
  })
  await t
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
  await t
    .expect(getNthStatusContent(1).innerText).eql('do not filter me!')
})

test('Can filter whole words', async t => {
  await postAs('admin', 'do not filter me!')
  await postAs('admin', 'anotherFilter okay!')
  await postAs('admin', 'anotherFilterEvenThoughItIsOneBigWord!')
  await sleep(500)
  await loginAsFoobar(t)
  await goToWordFilterSettings(t)
  await addFilter(t, 'filterMeOut')
  await t
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
  await t
    .expect(getNthStatusContent(1).innerText).eql('anotherFilterEvenThoughItIsOneBigWord!')
})

test('Can add filters on the fly', async t => {
  await postAs('admin', 'hehehehehehe')
  await postAs('admin', 'hohohohohoho')
  await postAs('admin', 'hahahahahaha')
  await sleep(500)
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusContent(1).innerText).eql('hahahahahaha')
  await goToWordFilterSettings(t)
  await t
    .expect($('body').innerText).contains('You don\'t have any word filters.')
  await addFilter(t, 'hahahahahaha')
  await t
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthStatusContent(1).innerText).eql('hohohohohoho')
  await goToWordFilterSettings(t)
  await addFilter(t, 'hohohohohoho')
  await t
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthStatusContent(1).innerText).eql('hehehehehehe')
})

test('Can delete filters on the fly', async t => {
  await postAs('admin', 'yalayala')
  await postAs('admin', 'yoloyolo')
  await sleep(500)
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusContent(1).innerText).eql('yoloyolo')
  await goToWordFilterSettings(t)
  await addFilter(t, 'yoloyolo')
  await t
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthStatusContent(1).innerText).eql('yalayala')
  await goToWordFilterSettings(t)
  await t
    .click($('button[aria-label="Delete"]'))
    .expect($('body').innerText).contains('You don\'t have any word filters.')
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
  await t
    .expect(getNthStatusContent(1).innerText).eql('yoloyolo')
})

test('Can update filters when change comes from the server', async t => {
  await postAs('admin', 'ohwowohwow')
  await postAs('admin', 'ohboyohboy')
  await sleep(500)
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusContent(1).innerText).eql('ohboyohboy')
  await sleep(500)
  await createWordFilterAs('foobar', {
    phrase: 'ohboyohboy',
    context: [...WORD_FILTER_CONTEXTS],
    whole_word: false
  })
  await t
    .expect(getNthStatusContent(1).innerText).eql('ohwowohwow')
})

test('Can filter notifications', async t => {
  await postAs('admin', 'hey @foobar do not filter this pretty please')
  await postAs('admin', 'hey @foobar filterthisplease')
  await sleep(500)
  await loginAsFoobar(t)

  await goToWordFilterSettings(t)
  await addFilter(t, 'filterthisplease', async t => {
    // uncheck all contexts except notifications
    const contexts = WORD_FILTER_CONTEXTS.filter(_ => _ !== WORD_FILTER_CONTEXT_NOTIFICATIONS)
    for (const context of contexts) {
      await t.click(`input[id="where-to-filter-${context}"]`)
    }
    await sleep(200)
  })
  await t
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthStatusContent(1).innerText).contains('filterthisplease')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('notifications')
    .expect(getNthStatusContent(1).innerText).contains('do not filter this pretty please')
})

test('Can filter reblogs', async t => {
  await postAs('admin', 'you definitely want to see this')
  const { id } = await postAs('baz', 'dontwanttoseethis')
  await reblogStatusAs('admin', id)
  await sleep(500)
  await loginAsFoobar(t)
  await goToWordFilterSettings(t)
  await addFilter(t, 'dontwanttoseethis')
  await t
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthStatusContent(1).innerText).contains('you definitely want to see this')
})
