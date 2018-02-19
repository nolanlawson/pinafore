// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (email, password) => {
  // mastodon throws some uncaught TypeErrors
  cy.on('uncaught:exception', (err) => {
    expect(err.name).to.include('TypeError')
    expect(err.message).to.include('Illegal invocation')
    return false
  })

  cy.visit('/settings/instances/add')
  cy.get('#instanceInput').clear().type('localhost:3000')
  cy.get('.add-new-instance').submit()
  cy.url().should('equal', 'http://localhost:3000/auth/sign_in')
  cy.get('input#user_email').should('exist')
  cy.get('input#user_password').should('exist')
  cy.get('input#user_email').type(email)
  cy.get('input#user_password').type(password)
  cy.get('form#new_user').submit()
  cy.url().should('contain', '/oauth/authorize')

  cy.get('button').contains('Authorize').click()
  cy.url().should('equal', 'http://localhost:4002/')
})

Cypress.Commands.add('getNthVirtualArticle', (n) => {
  return cy.get(`.virtual-list-item[aria-hidden=false] article[aria-posinset=${n}]`)
})

Cypress.Commands.add('validateTimeline', (timeline) => {
  timeline.forEach((status, i) => {
    if (status.content) {
      cy.getNthVirtualArticle(i).get('.status-content p').should('contain', status.content)
    }
    if (status.spoiler) {
      cy.getNthVirtualArticle(i).get('.status-spoiler p').should('contain', status.spoiler)
    }
    if (status.followedBy) {
      cy.getNthVirtualArticle(i).get('.status-header span').should('contain', status.followedBy)
      cy.getNthVirtualArticle(i).get('.status-header span').should('contain', 'followed you')
    }
    cy.getNthVirtualArticle(i).scrollIntoView()
  })
})