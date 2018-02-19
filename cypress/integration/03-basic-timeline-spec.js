const times = require('lodash/times')

describe('Basic timeline spec', () => {
  beforeEach(() => {
    cy.login('foobar@localhost:3000', 'foobarfoobar')
    cy.visit('/')
    cy.wait(500)
  })

  const homeTimeline = [
    {content: 'pinned toot 1'},
    {content: 'notification of unlisted message'},
    {content: 'notification of followers-only message'},
    {content: 'notification of direct message'},
    {content: 'this is unlisted'},
    {content: 'this is followers-only'},
    {content: 'direct'},
    {spoiler: 'kitten CW'},
    {content: 'secret video'},
    {content: "here's a video"},
    {spoiler: 'CW'},
    {content: "here's a secret animated kitten gif"},
    {content: "here's an animated kitten gif"},
    {content: "here's 2 kitten photos"},
    {content: "here's a secret kitten"},
    {content: "here's a kitten"},
    {content: 'hello admin'},
    {content: 'hello foobar'},
    {content: 'hello world'}
  ].concat(times(30, i => ({content: (30 - i).toString()})))

  const localTimeline = [
    {spoiler: 'kitten CW'},
    {content: 'secret video'},
    {content: "here's a video"},
    {spoiler: 'CW'},
    {content: "here's a secret animated kitten gif"},
    {content: "here's an animated kitten gif"},
    {content: "here's 2 kitten photos"},
    {content: "here's a secret kitten"},
    {content: "here's a kitten"},
    {content: 'hello world'}
  ].concat(times(30, i => ({content: (30 - i).toString()})))

  const notifications = [
    {favoritedBy: 'admin'},
    {rebloggedBy: 'admin'},
    {content: 'notification of unlisted message'},
    {content: 'notification of followers-only message'},
    {content: 'notification of direct message'},
    {followedBy: 'quux'},
    {content: 'hello foobar'},
    {followedBy: 'admin'}
  ]

  const favorites = [
    {content: 'notification of direct message'},
    {content: 'notification of followers-only message'},
    {content: 'notification of unlisted message'},
    {content: 'pinned toot 1'}
  ]

  const pinnedStatuses = [
    {content: 'this is unlisted'}
  ]

  it('Shows the home timeline', () => {
    cy.get('.virtual-list-item[aria-hidden=false] .status-article:first').should('have.attr', 'aria-setsize')
    cy.get('.virtual-list-item[aria-hidden=false] .status-article:first').should('have.attr', 'aria-posinset', '0')

    cy.validateTimeline(homeTimeline)

    cy.get('.virtual-list-item[aria-hidden=false] .status-article:first').should('have.attr', 'aria-setsize', '49')
  })

  it('Shows notifications', () => {
    cy.get('nav a[aria-label=Notifications]').click()
    cy.url().should('contain', '/notifications')

    cy.validateTimeline(notifications)
  })

  it('Shows the local timeline', () => {
    cy.get('nav a[aria-label=Local]').click()
    cy.url().should('contain', '/local')

    cy.validateTimeline(localTimeline)
  })

  it('Shows the federated timeline', () => {
    cy.get('nav a[aria-label=Community]').click()
    cy.url().should('contain', '/community')
    cy.get('a').contains('Federated').click()
    cy.url().should('contain', '/federated')

    cy.validateTimeline(localTimeline) // local is same as federated in this case
  })

  it('Shows favorites', () => {
    cy.get('nav a[aria-label=Community]').click()
    cy.url().should('contain', '/community')
    cy.get('a').contains('Favorites').click()
    cy.url().should('contain', '/favorites')
    cy.validateTimeline(favorites)
  })

})
