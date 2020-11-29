import { mark, stop } from '../../_utils/marks'

export function navComputations (store) {
  mark('navComputations')

  store.compute(
    'pinnedListTitle',
    ['lists', 'pinnedPage'],
    (lists, pinnedPage) => {
      if (!pinnedPage.startsWith('/lists')) {
        return
      }
      const listId = pinnedPage.split('/').slice(-1)[0]
      const list = lists.find(_ => _.id === listId)
      return list ? list.title : ''
    }
  )

  store.compute(
    'navPages',
    ['pinnedPage', 'pinnedListTitle'],
    (pinnedPage, pinnedListTitle) => {
      let pinnedPageObject
      if (pinnedPage === '/federated') {
        pinnedPageObject = {
          name: 'federated',
          href: '/federated',
          svg: '#fa-globe',
          label: 'intl.federated'
        }
      } else if (pinnedPage === '/direct') {
        pinnedPageObject = {
          name: 'direct',
          href: '/direct',
          svg: '#fa-envelope',
          label: 'intl.directMessages'
        }
      } else if (pinnedPage === '/favorites') {
        pinnedPageObject = {
          name: 'favorites',
          href: '/favorites',
          svg: '#fa-star',
          label: 'intl.favorites'
        }
      } else if (pinnedPage === '/bookmarks') {
        pinnedPageObject = {
          name: 'bookmarks',
          href: '/bookmarks',
          svg: '#fa-bookmark',
          label: 'intl.bookmarks'
        }
      } else if (pinnedPage.startsWith('/lists/')) {
        pinnedPageObject = {
          name: `lists/${pinnedPage.split('/').slice(-1)[0]}`,
          href: pinnedPage,
          svg: '#fa-bars',
          label: pinnedListTitle
        }
      } else { // local
        pinnedPageObject = {
          name: 'local',
          href: '/local',
          svg: '#fa-users',
          label: 'intl.local'
        }
      }

      return [
        {
          name: 'home',
          href: '/',
          svg: '#pinafore-logo',
          label: 'intl.home'
        },
        {
          name: 'notifications',
          href: '/notifications',
          svg: '#fa-bell',
          label: 'intl.notifications'
        },
        pinnedPageObject,
        {
          name: 'community',
          href: '/community',
          svg: '#fa-comments',
          label: 'intl.community'
        },
        {
          name: 'search',
          href: '/search',
          svg: '#fa-search',
          label: 'intl.search'
        },
        {
          name: 'settings',
          href: '/settings',
          svg: '#fa-gear',
          label: 'intl.settings'
        }
      ]
    }
  )

  stop('navComputations')
}
