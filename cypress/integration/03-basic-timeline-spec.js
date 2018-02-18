describe('Basic timeline spec', () => {
  before(() => {
    cy.login('foobar@localhost:3000', 'foobarfoobar')
  })
  beforeEach(() => {
    cy.visit('/')
  })

  it('Shows some articles', () => {
    cy.get('.virtual-list-item[aria-hidden=false] .status-article:first').should('have.attr', 'aria-setsize')
    cy.get('.virtual-list-item[aria-hidden=false] .status-article:first').should('have.attr', 'aria-posinset', '0')
    cy.getNthVirtualArticle(0).get('.status-content p').should('contain', 'this is unlisted')

    cy.getNthVirtualArticle(1).get('.status-content p').should('contain', 'this is followers-only')
    cy.getNthVirtualArticle(2).get('.status-content p').should('contain', 'direct')
    cy.getNthVirtualArticle(3).get('.status-spoiler p').should('contain', 'kitten CW')
    cy.getNthVirtualArticle(4).get('.status-content p').should('contain', 'secret video')
    cy.getNthVirtualArticle(4).scrollIntoView()
    cy.getNthVirtualArticle(5).get('.status-content p').should('contain', "here's a video")
    cy.getNthVirtualArticle(6).get('.status-spoiler p').should('contain', 'CW')
    cy.getNthVirtualArticle(7).get('.status-content p').should('contain', "here's a secret animated kitten gif")
    cy.getNthVirtualArticle(8).get('.status-content p').should('contain', "here's an animated kitten gif")
    cy.getNthVirtualArticle(8).scrollIntoView()
    cy.getNthVirtualArticle(9).get('.status-content p').should('contain', "here's 2 kitten photos")
    cy.getNthVirtualArticle(10).get('.status-content p').should('contain', "here's a secret kitten")
    cy.getNthVirtualArticle(11).get('.status-content p').should('contain', "here's a kitten")
    cy.getNthVirtualArticle(11).scrollIntoView()
    cy.getNthVirtualArticle(12).get('.status-content p').should('contain', 'hello admin')
    cy.getNthVirtualArticle(13).get('.status-content p').should('contain', 'hello foobar')
    cy.getNthVirtualArticle(14).get('.status-content p').should('contain', 'hello world')
    cy.getNthVirtualArticle(14).scrollIntoView()

    for (let i = 0; i < 30; i++) {
      cy.getNthVirtualArticle(15 + i).scrollIntoView()
      cy.getNthVirtualArticle(15 + i).get('.status-content p').should('contain', (30 - i).toString())
    }

    cy.get('.virtual-list-item[aria-hidden=false] .status-article:first').should('have.attr', 'aria-setsize', (30 + 15).toString())
  })
})
