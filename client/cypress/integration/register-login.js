/* eslint-disable no-undef */
// ./node_modules/.bin/cypress open

describe('E2e test - register/login page', () => {
  before(() => {
    cy.exec('mongo appetizeDB_E2E_TEST --eval "db.dropDatabase()"');
  })

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

    cy.get('#logout-button').click();
    cy.url().should('not.include', '/profile')
  })
  it('Registers the user with same email fails with error message', () => {
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
    cy.url().should('not.include', '/profile')

    cy.get('#register-login-error')
    .invoke('text')
    .then(text => text)
    .should('eq', 'User already exists')
  })
})

describe('E2e test - register/login page', () => {
  it('Login of the user', () => {
    cy.visit('http://localhost:3000')

    cy.get('#switch-user-link').click()

    cy.get('#email')
    .type('ann.appetize@email.com')
    .should('have.value', 'ann.appetize@email.com')

    cy.get('#password')
    .type('secret123')
    .should('have.value', 'secret123')

    cy.get('#register-login').click()
    cy.url().should('include', '/profile')

    cy.get('#logout-button').click();
    cy.url().should('not.include', '/profile')
  })
})