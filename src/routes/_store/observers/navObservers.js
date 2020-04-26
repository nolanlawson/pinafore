import { emit } from '../../_utils/eventBus'
import { normalizePageName } from '../../_utils/normalizePageName'

export function navObservers (store) {
  function pageIsInNav (store, page) {
    const { navPages } = store.get()
    return navPages.find(_ => _.name === page)
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
