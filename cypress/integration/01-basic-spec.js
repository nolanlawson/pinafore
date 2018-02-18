describe('Basic spec', () => {
	beforeEach(() => {
		cy.visit('/')
	})

	it('has the correct <h1>', () => {
		cy.contains('h1', 'Pinafore')
	})

  it('navigates to about', () => {
    cy.get('nav a').contains('Settings').click()
    cy.url().should('contain', '/settings')
    cy.get('a').contains('About').click()
    cy.url().should('contain', '/settings/about')
    cy.contains('h1', 'About Pinafore')
  })

	it('navigates to /settings/instances/add', () => {
		cy.contains('log in to an instance').click()
		cy.url().should('contain', '/settings/instances/add')
	})

  it('navigates to settings/instances', () => {
    cy.get('nav a').contains('Settings').click()
    cy.url().should('contain', '/settings')
    cy.get('a').contains('Instances').click()
    cy.url().should('contain', '/settings/instances')
    cy.contains("You're not logged in to any instances")
  })
	
})