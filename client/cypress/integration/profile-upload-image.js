/* eslint-disable no-undef */
// ./node_modules/.bin/cypress open

// https://docs.cypress.io/guides/references/best-practices#Selecting-Elements
// https://www.npmjs.com/package/cypress-react-selector
// https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/file-upload-react
// https://github.com/abramenal/cypress-file-upload

describe('E2e test - profile page', () => {
  beforeEach(() => {
    cy.exec('mongo appetizeDB_E2E_TEST --eval "db.dropDatabase()"');
  })

  it('Update the user zip code after register', () => {
    cy.visit('http://localhost:3000')

    // first create user
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

    // check if the user has no zip code
    cy.get('#update-zip-code-message')
    .invoke('text')
    .then(text => text)
    .should('eq', 'Please update the zip code')

    // update zip code
    cy.get('#zip-code-field')
    .type('10179')
    .should('have.value', '10179')

    cy.get('#save-zip-code-button').click()

    cy.get('#update-zip-code-message')
    .invoke('text')
    .then(text => text)
    .should('eq', '')

    cy.get('#daily-treat-upload-button').click()
    cy.get('.MuiDropzoneArea-root').click()

  })

})