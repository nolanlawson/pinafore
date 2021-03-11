import { Selector as $ } from 'testcafe'
import { loginAsFoobar } from '../roles'
import { createWordFilterAs, deleteAllWordFiltersAs, postAs } from '../serverActions'
import { WORD_FILTER_CONTEXTS } from '../../src/routes/_static/wordFilters'
import { getNthStatusContent, homeNavButton, modalDialog, settingsNavButton, sleep } from '../utils'

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

const addFilter = async (t, phrase) => {
  await t
    .click($('button').withText('Add filter'))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .typeText($('input[type=text]#word-filter-word-or-phrase'), phrase)
    .click($('button').withText('Save'))
    .expect(modalDialog.exists).notOk()
}

test('Can filter basic words', async t => {
  await createWordFilterAs('foobar', {
    phrase: 'filterMeOut',
    context: [...WORD_FILTER_CONTEXTS],
    whole_word: false
  })
  await postAs('admin', 'do not filter me!')
  await postAs('admin', 'filterMeOut okay!')
  await postAs('admin', 'filterMeOutTooEvenThoughItIsOneBigWord!')
  await sleep(500)
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusContent(1).innerText).eql('do not filter me!')
})

test('Can filter whole words', async t => {
  await createWordFilterAs('foobar', {
    phrase: 'anotherFilter',
    context: [...WORD_FILTER_CONTEXTS],
    whole_word: true
  })
  await postAs('admin', 'do not filter me!')
  await postAs('admin', 'anotherFilter okay!')
  await postAs('admin', 'anotherFilterEvenThoughItIsOneBigWord!')
  await sleep(500)
  await loginAsFoobar(t)
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
    .expect(getNthStatusContent(1).innerText).eql('hohohohohoho')
  await goToWordFilterSettings(t)
  await addFilter(t, 'hohohohohoho')
  await t
    .click(homeNavButton)
    .expect(getNthStatusContent(1).innerText).eql('hehehehehehe')
})

test('Can delete filters on the fly', async t => {
  await postAs('admin', 'yoloyolo')
  await sleep(500)
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusContent(1).innerText).eql('yoloyolo')
  await goToWordFilterSettings(t)
  await addFilter(t, 'yoloyolo')
  await t
    .click(homeNavButton)
    .expect(getNthStatusContent(1).innerText).notEql('yoloyolo')
  await goToWordFilterSettings(t)
  await t
    .click($('button[aria-label="Delete"]'))
    .expect($('body').innerText).contains('You don\'t have any word filters.')
    .click(homeNavButton)
  await sleep(10000)
  await t
    .expect(getNthStatusContent(1).innerText).eql('yoloyolo')
})

test('Can update filters when change comes from the server', async t => {
  await postAs('admin', 'ohboyohboy')
  await sleep(500)
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusContent(1).innerText).eql('ohboyohboy')
  await sleep(200)
  await createWordFilterAs('foobar', {
    phrase: 'ohboyohboy',
    context: [...WORD_FILTER_CONTEXTS],
    whole_word: false
  })
  await t
    .expect(getNthStatusContent(1).innerText).notEql('ohboyohboy')
})
