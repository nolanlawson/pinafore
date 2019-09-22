import { emit } from '../../_utils/eventBus'

export function navObservers (store) {
  function pageIsInNav (store, page) {
    const { navPages } = store.get()
    return navPages.find(_ => _.name === page)
  }

  function normalizePageName (page) {
    // notifications/mentions are a special case; they show as selected in the nav
    return page === 'notifications/mentions' ? 'notifications' : page
  }

  store.observe('currentPage', (currentPage, previousPage) => {
    currentPage = normalizePageName(currentPage)
    previousPage = normalizePageName(previousPage)

    if (currentPage && previousPage &&
        pageIsInNav(store, currentPage) &&
        pageIsInNav(store, previousPage)) {
      emit('animateNavPart1', {
        fromPage: previousPage,
        toPage: currentPage
      })
    }
  }, {
    init: false
  })
}
