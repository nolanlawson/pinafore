const times = require('lodash/times')

describe('Basic timeline spec', () => {
  beforeEach(() => {
    cy.login('foobar@localhost:3000', 'foobarfoobar')
    cy.visit('/')
  })

  const homeTimeline = [
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

  const localTimeline = homeTimeline.slice()
  localTimeline.splice(0, 3)
  localTimeline.splice(9, 2)

  const notifications = [
    {followedBy: 'quux'},
    {content: 'hello foobar'},
    {followedBy: 'admin'}
  ]

  it('Shows the home timeline', () => {
    cy.get('.virtual-list-item[aria-hidden=false] .status-article:first').should('have.attr', 'aria-setsize')
    cy.get('.virtual-list-item[aria-hidden=false] .status-article:first').should('have.attr', 'aria-posinset', '0')

    cy.validateTimeline(homeTimeline)

    cy.get('.virtual-list-item[aria-hidden=false] .status-article:first').should('have.attr', 'aria-setsize', (30 + 15).toString())
  })

  it('Shows notifications', () => {
    cy.get('nav a').contains('Notifications').click()
    cy.url().should('contain', '/notifications')

    cy.validateTimeline(notifications)

  })

  it('Shows the local timeline', () => {
    cy.get('nav a').contains('Local').click()
    cy.url().should('contain', '/local')

    cy.validateTimeline(localTimeline)
  })

  it('Shows the federated timeline', () => {
    cy.get('nav a').contains('Community').click()
    cy.url().should('contain', '/community')
    cy.get('a').contains('Federated').click()
    cy.url().should('contain', '/federated')

    cy.validateTimeline(localTimeline) // local is same as federated in this case
  })
})
