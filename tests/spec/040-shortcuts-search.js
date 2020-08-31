import {
  getActiveElementTagName,
  getNthStatus,
  getUrl,
  searchButton, searchInput, searchNavButton
} from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'

fixture`040-shortcuts-search.js`
  .page`http://localhost:4002`

test('Pressing / goes to search and focuses input but does not prevent left/right hotkeys afterwards', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getNthStatus(1).exists).ok()
    .pressKey('/')
    .expect(getUrl()).contains('/search')
    .expect(getActiveElementTagName()).match(/input/i)
    .typeText(searchInput, 'foo', { paste: true })
    .click(searchButton) // unfocus from the input
    .expect(getActiveElementTagName()).notMatch(/input/i)
    .pressKey('right')
    .expect(getUrl()).contains('/settings')
    .pressKey('left')
    .expect(getUrl()).contains('/search')
    // search input is not autofocused if we didn't arrive via the search hotkeys
    .expect(getActiveElementTagName()).notMatch(/input/i)
})

test('Pressing / focuses the search input if we are already on the search page', async t => {
  await loginAsFoobar(t)
  await t
    .click(searchNavButton)
    .expect(getUrl()).contains('/search')
    .expect(getActiveElementTagName()).notMatch(/input/i)
    .pressKey('/')
    .expect(getActiveElementTagName()).match(/input/i)
})

test('Pressing / without logging in just goes to the search page', async t => {
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect($('.main-content h1').innerText).eql('Pinafore')
    .pressKey('/')
    .expect(getUrl()).contains('/search')
    .expect(getActiveElementTagName()).notMatch(/input/i)
})
