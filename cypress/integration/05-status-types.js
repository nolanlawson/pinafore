describe('05-status-types.js', () => {
  beforeEach(() => {
    cy.login('foobar@localhost:3000', 'foobarfoobar')
    cy.wait(500)
  })

  it('shows direct vs followers-only vs regular', () => {
    cy.getNthVirtualArticle(1).should('have.attr', 'aria-label', 'Status by admin')
    cy.getNthVirtualArticle(1).find('.status-content').should('contain', 'notification of unlisted message')
    cy.getNthVirtualArticle(1).find('.status-toolbar button:nth-child(2)')
      .should('have.attr', 'aria-label', 'Boost')
      .and('not.have.attr', 'disabled')

    cy.getNthVirtualArticle(2).should('have.attr', 'aria-label', 'Status by admin')
    cy.getNthVirtualArticle(2).find('.status-content').should('contain', 'notification of followers-only message')
    cy.getNthVirtualArticle(2).find('.status-toolbar button:nth-child(2)')
      .should('have.attr', 'aria-label', 'Cannot be boosted because this is followers-only')
      .and('have.attr', 'disabled')

    cy.getNthVirtualArticle(3).should('have.attr', 'aria-label', 'Direct message by admin')
    cy.getNthVirtualArticle(3).find('.status-content').should('contain', 'notification of direct message')
    cy.getNthVirtualArticle(3).find('.status-toolbar button:nth-child(2)')
      .should('have.attr', 'aria-label', 'Cannot be boosted because this is a direct message')
      .and('have.attr', 'disabled')
  })

  it('shows direct vs followers-only vs regular in notifications', () => {
    cy.visit('/notifications')
    cy.wait(500)

    cy.getNthVirtualArticle(2).should('have.attr', 'aria-label', 'Status by admin')
    cy.getNthVirtualArticle(2).find('.status-content').should('contain', 'notification of unlisted message')
    cy.getNthVirtualArticle(2).find('.status-toolbar button:nth-child(2)')
      .should('have.attr', 'aria-label', 'Boost')
      .and('not.have.attr', 'disabled')

    cy.getNthVirtualArticle(3).should('have.attr', 'aria-label', 'Status by admin')
    cy.getNthVirtualArticle(3).find('.status-content').should('contain', 'notification of followers-only message')
    cy.getNthVirtualArticle(3).find('.status-toolbar button:nth-child(2)')
      .should('have.attr', 'aria-label', 'Cannot be boosted because this is followers-only')
      .and('have.attr', 'disabled')

    cy.getNthVirtualArticle(4).should('have.attr', 'aria-label', 'Direct message by admin')
    cy.getNthVirtualArticle(4).find('.status-content').should('contain', 'notification of direct message')
    cy.getNthVirtualArticle(4).find('.status-toolbar button:nth-child(2)')
      .should('have.attr', 'aria-label', 'Cannot be boosted because this is a direct message')
      .and('have.attr', 'disabled')
  })
})
