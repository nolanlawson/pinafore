describe('Login spec', () => {
	beforeEach(() => {
		cy.visit('/')
	})

	it('Cannot log in to a fake instance', () => {
		cy.get('a').contains('log in to an instance').click()

    cy.get('#instanceInput').clear().type('fake.nolanlawson.com')
    cy.get('.add-new-instance').submit()
    cy.get('.form-error', {timeout: 20000}).contains('Is this a valid Mastodon instance?')
    cy.get('#instanceInput').type('.biz')
    cy.get('.form-error').should('not.exist')
    cy.get('#instanceInput').clear().type('fake.nolanlawson.com')
    cy.get('.form-error').should('exist')
	})

  it('Logs in to localhost:3000', () => {
    cy.login('foobar@localhost:3000', 'foobarfoobar')

    cy.url().should('equal', 'http://localhost:4002/')
    cy.get('article.status-article').should('exist')
  })

  it('Logs out', () => {
    cy.login('foobar@localhost:3000', 'foobarfoobar')
    cy.get('nav a').contains('Settings').click()
    cy.get('a').contains('Instances').click()
    cy.get('a').contains('localhost:3000').click()
    cy.url().should('contain', '/settings/instances/localhost:3000')
    cy.get('button').contains('Log out').click()
    cy.get('button').contains('OK').click()
    cy.url().should('contain', '/settings/instances')
    cy.contains("You're not logged in to any instances")
  })

})