/// <reference types="Cypress" />

const delayTime = 500
context('CreatePlanningByTarget', () => {

  it('should create a planning based on target', () => {
    cy.visit("/")
    cy.login()
    cy.delay(delayTime)

    // Select a brand
    cy.get('[data-cy="btn-brand-0"]').click();

    // Start a planning
    cy.get('[data-cy="btn-start-planning"]').click();
    cy.delay(delayTime)

    // 1
    // Type a name of
    cy.get('#input-1').type('New planning test');
    cy.delay(delayTime)

    cy.get('[data-cy="radio-show-cities"]').siblings('label').click();
    cy.get('[data-cy="radio-show-cities"]').check();
    cy.delay(delayTime)

    // Search for a city
    cy.get('[data-cy="input-dropdown"]').type('São');
    cy.delay(delayTime)

    // Select a city
    cy.get('[data-cy="input-dropdown-item-0"]').click();
    cy.delay(delayTime)

    // Go to 2
    cy.get('[data-cy="btn-next"]').click();
    cy.delay(delayTime)

    // 2
    // Search for a target
    cy.get('[data-cy="input-search"]').type('du');
    cy.delay(delayTime)

    // Select the second target
    cy.get('[data-cy="badge-target-0"]').click();
    cy.delay(delayTime)

    // Go to 3
    cy.get('[data-cy="btn-next"]').click();

    cy.intercept('/media-plans/medias/?mediaPlan=*', {
      fixture: "medias.json"
    })
    cy.delay(delayTime)

    // 3
    cy.get('[data-cy="check-media-0"]').click();
    cy.delay(delayTime)

    cy.get('[data-cy="check-none-startdate"]').click();
    cy.delay(delayTime)

    // Go to 4
    cy.get('[data-cy="btn-next"]').click();
    cy.delay(delayTime)

    // 4
    // Select a planning
    cy.get('[data-cy="check-budget-item-00"]').click();
    cy.delay(delayTime)

    // Go to 5
    cy.get('[data-cy="btn-next"]').click();
    cy.delay(delayTime)

    // expect
    cy.get('h3').should('have.text', 'New planning test');

  })
})