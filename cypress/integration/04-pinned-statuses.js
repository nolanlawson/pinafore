describe('04-pinned-statuses.js', () => {
  beforeEach(() => {
    cy.login('foobar@localhost:3000', 'foobarfoobar')
    cy.wait(500)
  })

  it("shows a user's pinned statuses", () => {
    cy.get('nav a[aria-label=Community]').click()
    cy.url().should('contain', '/community')
    cy.get('a').contains('Pinned').click()
    cy.url().should('contain', '/pinned')

    cy.get('.status-article').should('have.attr', 'aria-posinset', '0')
    cy.get('.status-article').should('have.attr', 'aria-setsize', '1')
    cy.get('.status-article .status-content').should('contain', 'this is unlisted')
  })

  it("shows pinned statuses on a user's account page", () => {
    cy.visit('/accounts/2')
    cy.wait(500)
    cy.get('.pinned-statuses .status-article').should('have.attr', 'aria-posinset', '0')
    cy.get('.pinned-statuses .status-article').should('have.attr', 'aria-setsize', '1')
    cy.get('.pinned-statuses .status-article').should('contain', 'this is unlisted')
  })

  it("shows pinned statuses on a user's account page 2", () => {
    cy.visit('/accounts/3')
    cy.wait(500)
    cy.get('.pinned-statuses .status-article').should('have.attr', 'aria-posinset', '0')
    cy.get('.pinned-statuses .status-article').should('have.attr', 'aria-setsize', '2')
    cy.get('.pinned-statuses .status-article').should('contain', 'pinned toot 1')

    cy.get('.pinned-statuses .status-article[aria-posinset=1]').should('have.attr', 'aria-setsize', '2')
    cy.get('.pinned-statuses .status-article[aria-posinset=1]').should('contain', 'pinned toot 2')
  })
})
