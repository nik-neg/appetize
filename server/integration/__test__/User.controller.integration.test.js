/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
const supertest = require('supertest');
const sinon = require('sinon');
const User = require('../../models/User');
const db = require('../../models/db');
const startServer = require('../index');

jest.unmock('mongoose');
jest.unmock('../../models/User');

let resolvedServer;
let request;

async function removeAllCollections() {
  const collections = Object.keys(db.mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = db.mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
}

let sandbox;
beforeEach(() => startServer()
  .then(({ server, app }) => {
    resolvedServer = server;
    request = supertest(app);
    sandbox = sinon.createSandbox();
  }));

afterEach(async () => {
  resolvedServer.close();
  sandbox.restore();
  await removeAllCollections();
  await db.mongoose.disconnect();
});

describe('integration test of user controller - createUser', () => {
  test('should return 409, because user already exists', async () => {
    await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);

    await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(409);
  });
  test('should return 400, because of invalid input', async () => {
    await request.post('/register')
      .send({
        firstName: '',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(400);
  });
  test('should return 400, because of invalid input', async () => {
    await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: '',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(400);
  });
  test('should return 400, because of invalid input', async () => {
    await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: '',
        password: 'password',
      })
      .expect(400);
  });
  test('should return 400, because of invalid input', async () => {
    await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: '',
      })
      .expect(400);
  });
  test('should return 500, because of internal server error, when creating the user', async () => {
    sandbox.stub(User, 'create').throws(Error('User.create'));
    await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(500);
  });
  test('should save user to database and return 201', async () => {
    await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);
    const user = await User.findOne({ email: 'testing@test.com' });
    expect(user._id).toBeTruthy();
  });
});
describe('integration test of user controller - loginUser', () => {
  test('should return 400, because email or password is not provided', async () => {
    await request.post('/login')
      .send({
        email: '',
        password: 'password',
      })
      .expect(400);
  });
  test('should return 400, because email or password is not provided', async () => {
    await request.post('/login')
      .send({
        email: 'testing@test.com',
        password: '',
      })
      .expect(400);
  });
  test('should return 500, because of internal server error', async () => {
    sandbox.stub(User, 'findOne').throws(Error('User.create'));
    await request.post('/login')
      .send({
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(500);
  });
  test('should return 401, because of wrong password', async () => {
    await request.post('/register') // better to create via register then to create and hash password here
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);
    await request.post('/login')
      .send({
        email: 'testing@test.com',
        password: 'wrongPassword',
      })
      .expect(401);
  });
  test('should return 200, because email and password are correct', async () => {
    await request.post('/register') // better to create via register then to create and hash password here
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);
    await request.post('/login')
      .send({
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(200);
  });
});
