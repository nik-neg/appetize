/* eslint-disable no-undef */
// ./node_modules/.bin/cypress open

describe('E2e test - profile page, dropzone', () => {
  before(() => {
    cy.exec('mongo appetizeDB_E2E_TEST --eval "db.dropDatabase()"');
  })
  it('Add new image', () => {
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
  })

  it('Remove chosen image, cancel dropzone', () => {
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

    cy.get('.MuiDropzonePreviewList-removeButton').click()
    // assert preview
    cy.get('.MuiDropzonePreviewList-image').should('not.exist');
    // assert removed message
    cy.get('.MuiSnackbarContent-message').invoke('text').then((text) => {
      expect(text).equal(`File ${fileName} removed.`)
    });

    cy.contains('cancel').click()
    cy.get('.MuiDialog-scrollPaper').should('not.exist');
  })
  it('Remove chosen image, choose new one', () => {
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

    cy.get('.MuiDropzonePreviewList-removeButton').click()
    // assert preview
    cy.get('.MuiDropzonePreviewList-image').should('not.exist');
    // assert removed message
    cy.get('.MuiSnackbarContent-message').invoke('text').then((text) => {
      expect(text).equal(`File ${fileName} removed.`)
    });

    fileName = 'pizza.png';
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
  })
  it('Dropzone is not available due to not updated zip code', () => {
    cy.exec('mongo appetizeDB_E2E_TEST --eval "db.dropDatabase()"');

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

    cy.get('button[aria-label="foto"]').click()
    cy.get('.MuiDialog-scrollPaper').should('not.exist');

    cy.get('#daily-treat-upload-button').click()
    cy.get('.MuiDialog-scrollPaper').should('not.exist');
  });
})