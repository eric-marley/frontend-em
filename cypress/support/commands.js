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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', () => {
  cy.get('#email').clear();
  cy.get('#email').type('dev@dev.com');
  cy.get('#password').clear();
  cy.get('#password').type('1234');
  cy.get('span').click();
  cy.get('strong').should('have.text', 'Desenvolvedor da Silva Sauro Ads');
  cy.get('h1').should('have.text', 'Olá, Desenvolvedor da Silva Sauro Ads, bem-vindo a Eletromidia');
})

Cypress.Commands.add('delay', (time = null) => {
  if (time) {
    cy.wait(time)
  }
})