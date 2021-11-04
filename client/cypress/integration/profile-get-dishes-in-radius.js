/* eslint-disable no-undef */
// ./node_modules/.bin/cypress open

describe('E2e test - profile page, publish daily treat', () => {
  beforeEach(() => {
    cy.exec('mongo appetizeDB_E2E_TEST --eval "db.dropDatabase()"');
  })
  it('Get dish in radius of one user', () => {
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
  })

  it('Get dishes in radius of different users', () => {
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
    cy.get('.cards-position').should('exist');
    cy.get('.card-box').should('have.length', 2);
  })
  it('Get dishes in radius of different users, vote for dish', () => {
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

    cy.get('#logout-button').click();
    cy.url().should('not.include', '/profile')


    // login with other user
    cy.get('#switch-user-link').click()

    cy.get('#email')
    .type('ann.appetize@email.com')
    .should('have.value', 'ann.appetize@email.com')

    cy.get('#password')
    .type('secret123')
    .should('have.value', 'secret123')

    cy.get('#register-login').click()
    cy.url().should('include', '/profile')
    cy.wait(2500)
    cy.get('#dishes-in-radius-button').click()
    cy.get('.cards-position').should('exist');
    cy.get('.card-box').should('have.length', 2);

    cy.get('#dish-votes-0')
    .invoke('text')
    .then(text => text)
    .should('eq', '0')
    cy.get('#dish-votes-1')
    .invoke('text')
    .then(text => text)
    .should('eq', '0')
    cy.get('.like').click({ multiple: true }) // simulates only click on the one, which is enabled
    cy.wait(500)
    cy.get('#dish-votes-0')
    .invoke('text')
    .then(text => text)
    .should('eq', '1')
    cy.get('#dish-votes-1')
    .invoke('text')
    .then(text => text)
    .should('eq', '0')

    // unlike dish
    cy.wait(500)
    cy.get('.like').click({ multiple: true }) // simulates only click on the one, which is enabled
    cy.wait(500)
    cy.get('#dish-votes-0')
    .invoke('text')
    .then(text => text)
    .should('eq', '0')
    cy.get('#dish-votes-1')
    .invoke('text')
    .then(text => text)
    .should('eq', '0')
  })

  it('Get dishes in radius of different users, remove dishes', () => {
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
    cy.wait(500)
    cy.get('.cards-position').should('exist');
    cy.get('.card-box').should('have.length', 2);

    cy.get('#star-icon').should('be.visible')
    cy.get('.delete-button').trigger('mouseover')
    cy.get('#delete-icon').should('be.visible')
    cy.get('.delete-button').trigger('mouseover').click({ force: true }) // { multiple: true }
    cy.get('.cards-position').should('exist');
    cy.get('.card-box').should('have.length', 1);
  })
})