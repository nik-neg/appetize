/* eslint-disable no-undef */
// ./node_modules/.bin/cypress open

describe('E2e test - profile page, publish daily treat', () => {
  beforeEach(() => {
    cy.exec('mongo appetizeDB_E2E_TEST --eval "db.dropDatabase()"');
  })
  it('Get dish in radius of one user', () => {
    cy.visit('http://localhost:3000')

    // first create first user
    const firstName = 'Ann';
    cy.get('#firstName')
    .type(firstName)
    .should('have.value', firstName)

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

    const recipe = 'Noodles, mushrooms, nori, egg, onions, shoyu soup.';
    cy.get('#dish-recipe')
    .type(recipe)
    .should('have.value', recipe)

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

    cy.get('#dishes-in-radius-button').click()
    cy.wait(2000)
    cy.get('.cards-position').should('exist');
    cy.get('.card-box').should('have.length', 1);
    cy.get('.like[style="color: rgb(255, 0, 0);"]').should('exist');

    // check dish data
    cy.get('#dish-title-0').contains('Ramen')

    cy.get('#dish-description-0')
    .invoke('text')
    .then(text => text)
    .should('eq', 'Home cooked with love :)')

    // check expand functionality
    cy.get('#dish-expand-0').click()
    cy.get('.MuiCollapse-wrapperInner').contains(firstName)
    cy.get('.MuiCollapse-wrapperInner').contains(recipe)
    cy.get('#dish-expand-0').click()
  })

  it.only('Get dishes in radius of different users with parameters', () => {
    cy.visit('http://localhost:3000')

    // first create first user
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

    let fileName = 'sushi.png';
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
    .type('Sushi')
    .should('have.value', 'Sushi')

    cy.get('#dish-description')
    .type('Nice and delicious ;)')
    .should('have.value', 'Nice and delicious ;)')

    cy.get('#dish-recipe')
    .type('Sushi hunter next to the beach')
    .should('have.value', 'Sushi hunter next to the beach')

    cy.get('input[name="ordered"]').check()
    cy.get('input[name="ordered"]').should('have.value', 'true')
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

    cy.get('#logout-button').click();
    cy.url().should('not.include', '/profile')

    // then create second user
    cy.visit('http://localhost:3000')

    cy.get('#firstName')
    .type('Tom')
    .should('have.value', 'Tom')

    cy.get('#lastName')
    .type('Hungry')
    .should('have.value', 'Hungry')

    cy.get('#email')
    .type('tom.hungry@email.com')
    .should('have.value', 'tom.hungry@email.com')

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
    cy.contains('submit').click()

    cy.get('#dish-title')
    .type('Pizza')
    .should('have.value', 'Pizza')

    cy.get('#dish-description')
    .type('Grandmother\'s recipe')
    .should('have.value', 'Grandmother\'s recipe')

    cy.get('#dish-recipe')
    .type('Secret ;)')
    .should('have.value', 'Secret ;)')

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

    cy.get('#dishes-in-radius-button').click()
    cy.wait(2500)
    cy.get('.cards-position').should('exist');
    cy.get('.card-box').should('have.length', 2);

    // check dish data
    cy.get('#dish-title-0').contains('Sushi')

    cy.get('#dish-description-0')
    .invoke('text')
    .then(text => text)
    .should('eq', 'Nice and delicious ;)')

    // check dish data
    cy.get('#dish-title-1').contains('Pizza')

    cy.get('#dish-description-1')
    .invoke('text')
    .then(text => text)
    .should('eq', 'Grandmother\'s recipe')

    // cooked, ordered searches
    // deselect ordered
    cy.get('#local-dishes-parameter-ordered').click()
    cy.get('#dishes-in-radius-button').click()
    cy.wait(2500)
    cy.get('.cards-position').should('exist');
    cy.get('.card-box').should('have.length', 1);
    // check dish data
    cy.get('#dish-title-0').contains('Pizza')

    cy.get('#dish-description-0')
    .invoke('text')
    .then(text => text)
    .should('eq', 'Grandmother\'s recipe')

    // deselect cooked
    cy.get('#local-dishes-parameter-cooked').click()
    // select ordered
    cy.get('#local-dishes-parameter-ordered').click()
    cy.get('#dishes-in-radius-button').click()
    cy.wait(2500)
    cy.get('.cards-position').should('exist');
    cy.get('.card-box').should('have.length', 1);
    // check dish data
    cy.get('#dish-title-0').contains('Sushi')

    cy.get('#dish-description-0')
    .invoke('text')
    .then(text => text)
    .should('eq', 'Nice and delicious ;)')
  })
})