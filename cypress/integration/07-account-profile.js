describe('07-account-profile.js', () => {
  beforeEach(() => {
    cy.login('foobar@localhost:3000', 'foobarfoobar')
    cy.wait(500)
  })

  it('shows account profile', () => {
    cy.get('.status-author-name').contains('quux').click()
    cy.url().should('contain', '/accounts/3')
    cy.wait(500)
    cy.get('.account-profile .account-profile-name').should('contain', 'quux')
    cy.get('.account-profile .account-profile-username').should('contain', '@quux')
    cy.get('.account-profile .account-profile-followed-by').should('contain', 'Follows you')
    cy.get('.account-profile .account-profile-follow button')
      .should('have.attr', 'aria-label', 'Follow')
      .and('have.attr', 'aria-pressed', 'false')
  })

  it('shows account profile 2', () => {
    cy.get('.status-author-name').contains('admin').click()
    cy.url().should('contain', '/accounts/1')
    cy.wait(500)
    cy.get('.account-profile .account-profile-name').should('contain', 'admin')
    cy.get('.account-profile .account-profile-username').should('contain', '@admin')
    cy.get('.account-profile .account-profile-followed-by').should('contain', 'Follows you')
    cy.get('.account-profile .account-profile-follow button')
      .should('have.attr', 'aria-label', 'Unfollow')
      .and('have.attr', 'aria-pressed', 'true')
  })

  it('shows account profile 3', () => {
    cy.get('.mention').contains('foobar').click()
    cy.url().should('contain', '/accounts/2')
    cy.wait(500)
    cy.get('.account-profile .account-profile-name').should('contain', 'foobar')
    cy.get('.account-profile .account-profile-username').should('contain', '@foobar')
    // can't follow or be followed by your own account
    cy.get('.account-profile .account-profile-followed-by').should('be.empty')
    cy.get('.account-profile .account-profile-follow').should('be.empty')
  })
})
