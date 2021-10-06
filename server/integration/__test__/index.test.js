/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
const supertest = require('supertest');
const db = require('../../models/db');
const startServer = require('../index');

jest.unmock('mongoose');

let resolvedServer;
let request;

async function removeAllCollections() {
  const collections = Object.keys(db.mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = db.mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
}

beforeEach(() => startServer()
  .then(({ server, app }) => {
    resolvedServer = server;
    request = supertest(app);
  }));

afterEach(async () => {
  resolvedServer.close();
  await removeAllCollections();
  await db.mongoose.disconnect();
});

describe('Integration test of user controller - createUser', () => {
  test('Should save user to database and return 201', async () => {
    await request.post('/register')
      .send({
        firstname: 'firstname',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);
  });
  test('Should return 409, because user already exists', async () => {
    await request.post('/register')
      .send({
        firstname: 'firstname',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);

    await request.post('/register')
      .send({
        firstname: 'firstname',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(409);
  });
});
