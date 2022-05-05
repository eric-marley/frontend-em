/// <reference types="Cypress" />

context('Logout', () => {
  it('should do the logout correctly', () => {
    cy.visit("/")
    cy.login()
    cy.delay(500)

    cy.get('#userProfile').click();
    cy.delay(1000)
    cy.get('[data-cy="action-logout"]').click();
    cy.delay(500)

    cy.get('h2').should('have.text', 'Login');
  })
})