/* eslint-disable no-undef */
// ./node_modules/.bin/cypress open

describe('E2e test - register/login page', () => {
  it('Registers the user', () => {
    cy.visit('http://localhost:3000')

    cy.get('#firstName')
    .type('Ann')
    .should('have.value', 'Ann')

    cy.get('#lastName')
    .type('Appetize')
    .should('have.value', 'Appetize')

    cy.get('#email')
    .type('ann.appetize@email.com')
    .should('have.value', 'ann.appetize@email.com')

    cy.get('#password')
    .type('secret123')
    .should('have.value', 'secret123')

    cy.get('#register-login').click()
    cy.url().should('include', '/profile')

  })
})