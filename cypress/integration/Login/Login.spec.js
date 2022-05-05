/// <reference types="Cypress" />

context('Login', () => {
  it('should do the login correctly', () => {
    cy.visit("/")
    cy.login()
    cy.delay(500)
    cy.get('h1').should('have.text', 'Olá, Desenvolvedor da Silva Sauro Ads, bem-vindo a Eletromidia');
  })
})