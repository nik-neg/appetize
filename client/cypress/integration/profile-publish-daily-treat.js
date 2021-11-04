/* eslint-disable no-undef */
// ./node_modules/.bin/cypress open

describe('E2e test - profile page, publish daily treat', () => {
  beforeEach(() => {
    cy.exec('mongo appetizeDB_E2E_TEST --eval "db.dropDatabase()"');
  })
  it('Upload image, change image after filling out form', () => {
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
    cy.get('.MuiDialog-scrollPaper').should('exist');

    let fileName = 'ramen.png';
    cy.fixture(fileName)
        .then(Cypress.Blob.base64StringToBlob)
        .then((fileContent) => {
        cy.get('input[accept="image/*"]').attachFile(
          {fileContent, fileName, mimeType: 'image/png'},{ subjectType: 'drag-n-drop' })
        })

    // assert preview
    cy.get('.MuiDropzonePreviewList-image').should('be.visible')

    // assert successful message
    cy.get('.MuiDropzoneSnackbar-successAlert').should('be.visible')
    cy.get('.MuiSnackbarContent-message').invoke('text').then((text) => {
      expect(text).equal(`File ${fileName} successfully added.`)
    });
    cy.contains('submit').click()

    cy.get('#dish-title')
    .type('Ramen')
    .should('have.value', 'Ramen')

    cy.get('#dish-description')
    .type('Home cooked with love :)')
    .should('have.value', 'Home cooked with love :)')

    cy.get('#dish-recipe')
    .type('Noodles, mushrooms, nori, egg, onions, shoyu soup.')
    .should('have.value', 'Noodles, mushrooms, nori, egg, onions, shoyu soup.')

    // change image removes dish data
    cy.get('#daily-treat-upload-button').click()
    cy.get('.MuiDialog-scrollPaper').should('exist');
    fileName = 'sushi.png';
    cy.fixture(fileName)
        .then(Cypress.Blob.base64StringToBlob)
        .then((fileContent) => {
        cy.get('input[accept="image/*"]').attachFile(
          {fileContent, fileName, mimeType: 'image/png'},{ subjectType: 'drag-n-drop' })
        })

    // assert preview
    cy.get('.MuiDropzonePreviewList-image').should('be.visible')

    // assert successful message
    cy.get('.MuiDropzoneSnackbar-successAlert').should('be.visible')
    cy.get('.MuiSnackbarContent-message').invoke('text').then((text) => {
      expect(text).equal(`File ${fileName} successfully added.`)
    });
    cy.contains('submit').click()

    cy.get('#dish-title')
    .invoke('text')
    .then(text => text)
    .should('eq', '')

    cy.get('#dish-description')
    .invoke('text')
    .then(text => text)
    .should('eq', '')

    cy.get('#dish-recipe')
    .invoke('text')
    .then(text => text)
    .should('eq', '')
  })

  it('Publish daily treat', () => {
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
    cy.get('.MuiDialog-scrollPaper').should('exist');

    const fileName = 'ramen.png';
    cy.fixture(fileName)
        .then(Cypress.Blob.base64StringToBlob)
        .then((fileContent) => {
        cy.get('input[accept="image/*"]').attachFile(
          {fileContent, fileName, mimeType: 'image/png'},{ subjectType: 'drag-n-drop' })
        })

    // assert preview
    cy.get('.MuiDropzonePreviewList-image').should('be.visible')

    // assert successful message
    cy.get('.MuiDropzoneSnackbar-successAlert').should('be.visible')
    cy.get('.MuiSnackbarContent-message').invoke('text').then((text) => {
      expect(text).equal(`File ${fileName} successfully added.`)
    });
    cy.contains('submit').click()

    cy.get('#dish-title')
    .type('Ramen')
    .should('have.value', 'Ramen')

    cy.get('#dish-description')
    .type('Home cooked with love :)')
    .should('have.value', 'Home cooked with love :)')

    cy.get('#dish-recipe')
    .type('Noodles, mushrooms, nori, egg, onions, shoyu soup.')
    .should('have.value', 'Noodles, mushrooms, nori, egg, onions, shoyu soup.')

    cy.get('input[name="cooked"]').check()
    cy.get('input[name="cooked"]').should('have.value', 'true')
    cy.wait(2500)
    cy.get('input[name="publish"]').check()
    cy.get('input[name="publish"]').should('have.value', 'true')

    cy.get('#dish-title')
    .should('have.value', '')

    cy.get('#dish-description')
    .should('have.value', '')

    cy.get('#dish-recipe')
    .should('have.value', '')

    cy.get('input[name="publish"]').should('have.value', 'false')
  })
})